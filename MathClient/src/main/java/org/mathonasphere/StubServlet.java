package org.mathonasphere;

import java.io.BufferedReader;
import java.io.FileOutputStream;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;


public class StubServlet extends HttpServlet {
  int counter = 0;
  int TOTAL_FRAMES = 100;
  SOSConnection sos;

  public void init() {
      //sos = new SOSConnection("localhost", 2468);
      //sos.connect();
      //System.out.println(sos.sendCommand("enable"));
      //System.out.println(sos.sendCommand("play images"));
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
    FileOutputStream fos = null;
    BufferedReader br = null;
    try {
      br = req.getReader();
      String header = br.readLine();
      String body = br.readLine();
      byte[] bytes = Base64.decodeBase64(body);
      fos = new FileOutputStream("tomcat/webapps/StubClient-0.1/output_"+counter+".png");
      fos.write(bytes);
      if(counter == TOTAL_FRAMES-1) {
          counter = 0;
      }
      else {
          counter++;
      }
    }
    catch (Exception e) {
      e.printStackTrace(System.err);
    }
    finally {
      try {
        fos.close();
        br.close();
      }
      catch (Exception e) {
          e.printStackTrace(System.err);
      }
    }
  }
}
