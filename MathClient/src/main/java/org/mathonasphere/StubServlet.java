package org.mathonasphere;

import java.util.concurrent.ArrayBlockingQueue;
//import java.lang.Thread;
import java.io.BufferedReader;
import java.io.FileOutputStream;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;

public class StubServlet extends HttpServlet {
    int counter = 0;
    int TOTAL_FRAMES = 2;
    int BUFFER_SIZE = 50;
    SOSConnection sos;
    String dir;
    long lastGoodTime = 0;
    int currentFrame = 0;
    boolean connectionGood = false;
    volatile byte[] lastData;
    volatile Thread thread;

    public StubServlet() {
        dir = System.getenv("MOS_IMAGES");
    }

    public void initConnection() {
        sos = new SOSConnection("localhost", 2468);
        try {
            String playlist = dir + "/math-on-a-sphere.sos";
            sos.connect();
            sos.sendCommand("enable");
            Thread.sleep(500);
            String response = sos.sendCommand("open_playlist " + playlist);
            Thread.sleep(500);
            if (!response.equals("R")) {
                throw new Exception("Invalid response when loading sequence - retrying");
            }
            sos.sendCommand("play");
            sos.sendCommand("next_clip");
            sos.sendCommand("next_clip");
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void threadMethod() {
        while (thread != null) {
            connectionGood = true;
            long time = System.currentTimeMillis();
            try {
                String response2 = sos.sendCommand("get_playlist_name");
                if (response2.indexOf("math-on-a-sphere") == -1) {
                    throw new Exception("Playlist not loaded - retrying");
                }
                currentFrame = Integer.parseInt(sos.sendCommand("get_frame_number"));
                lastGoodTime = time;
            } catch (Exception e) {
                connectionGood = false;
                if (time - lastGoodTime > 1000) {
                    lastGoodTime = time;
                    initConnection();
                }
            }
            try {
                int diff = (counter - currentFrame + TOTAL_FRAMES) % TOTAL_FRAMES;

                // System.out.print("(" + counter + ":" + currentFrame + ") " +
                // (time % 10000) + " ");
                // if (diff < BUFFER_SIZE) {
                // System.out.println("w");
                String str = String.format("%03d", counter);
                String filename = dir + "/" + str + ".png";
                FileOutputStream fos = null;
                if (lastData != null) {
                    fos = new FileOutputStream(filename);
                    byte[] data = lastData;
                    fos.write(data);
                    fos.close();
                    String response = sos.sendCommand("background " + filename);
                    lastData = null;
                    counter++;
                    counter = counter % TOTAL_FRAMES;
                }

                // }
                Thread.sleep(20);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void init() {
        initConnection();

        thread = new Thread() {
            public void run() {
                StubServlet.this.threadMethod();
            }
        };

        try {
            thread.start();
        } catch (Exception e) {
            System.out.println("Failed to start thread.");
        }
    }
    
    public void destroy() {
        thread = null;
    }

    public void service(ServletRequest req, ServletResponse res) {
        HttpServletRequest hreq = (HttpServletRequest) req;
        System.out.println(hreq.getMethod() + ": " + req.getContentLength());
        if (hreq.getMethod() == "POST") {
            // sos.sendCommand("get_frame_number");
            decodePostRequest(req);
        }
    }

    private void decodePostRequest(ServletRequest req) {
        // FileOutputStream fos = null;
        BufferedReader br = null;
        try {
            br = req.getReader();
            String header = br.readLine();
            String body = br.readLine();
            lastData = Base64.decodeBase64(body);

            // fos = new FileOutputStream("tomcat/webapps/StubClient-0.1/output_"+counter+".png");
            // fos.write(bytes);
        } catch (Exception e) {
            e.printStackTrace(System.err);
        } finally {
            try {
                br.close();
            } catch (Exception e) {
                e.printStackTrace(System.err);
            }
        }
    }
}
