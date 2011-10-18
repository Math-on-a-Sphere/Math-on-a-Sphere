package org.mathonasphere;

import java.io.*;
import java.net.*;

public class SOSConnection {
    Socket socket = null;
    PrintWriter out = null;
    BufferedReader in = null;
    BufferedReader stdIn = null;
    String host;
    int port;

    SOSConnection(String host, int port){
        this.host = host;
        this.port = port;
    }

    public void connect() {
        try {
            socket = new Socket(host, port);
            out = new PrintWriter(socket.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

        } 
        catch (UnknownHostException e) {
            System.out.println("Don't know about host:" + host);
            disconnect();
        } 
        catch (IOException e) {
            System.out.println("Couldn't get I/O for " + "the connection to: " + host);
            disconnect();
        }
        
    }
     
    public String sendCommand(String command) {
        String response = null;
        try {
            out.println(command+"\r");
            out.flush();
            
            while ((response = in.readLine()) == null) {
            }
        }
        catch(Exception e) {
            System.out.println("Exception on send");
            disconnect();
        }

        return response;
    }


    private void testCommands() {
        String userInput = "";
        String fromSOS = "";
    
        try {
            stdIn = new BufferedReader(new InputStreamReader(System.in));
            while ((fromSOS = in.readLine()) != null) {
                System.out.println("echo: " + fromSOS);
                userInput = stdIn.readLine();
                if(userInput != null) {
                    if(userInput.equals("bye")) {
                        break;
                    }
                    out.println(userInput+"\r");
                    out.flush();
                }
            }
            
            stdIn.close();
        }
        catch(IOException e) {
            System.out.println("error on IO send");
            disconnect();
        }
        catch(Exception e) {
            System.out.println("error on send");
            disconnect();
        }
    }


    protected void disconnect() {
        try {
            out.println("exit\r");
            out.flush();
            out.close();
            in.close();
            socket.close();
            System.out.println("disconnected. ");
        }
        catch(IOException e) {
            System.out.println("error on IO send");
        }
    }



    public static void main(String[] args) throws IOException {
        SOSConnection sos;

        if(args.length < 3) {
            System.out.println("usage: java SOSConnection <host> <port>");
        }
        else {
            sos = new SOSConnection(args[0], Integer.parseInt(args[1]));
            sos.connect();
            //sos.testCommands();
            System.out.println(sos.sendCommand("enable"));
            sos.disconnect();
        }
    }

}
