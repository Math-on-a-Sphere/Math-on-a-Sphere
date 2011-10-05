package org.mathonasphere;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

public class TelnetExample {

  public static void main(String[] arg) {
    try {
      JSch jsch = new JSch();
      Session session = jsch.getSession("userid", "localhost", 80);
      //session.setPassword("password");
      java.util.Properties config = new java.util.Properties();
      config.put("StrictHostKeyChecking", "no");
      session.setConfig(config);

      session.connect();
      System.out.println("==>" + executeCommand(session, "helo"));
      // System.out.println("==>" + executeCommand(session, "date"));
      // System.out.println("==>" + executeCommand(session, "ls"));
      // System.out.println("==>" + executeCommand(session, "who"));
      // System.out.println("==>" + executeCommand(session,
      // "tail -50 /path/abcd.log"));

      session.disconnect();
    }
    catch (Exception e) {
      e.printStackTrace();
    }
  }

  private static String executeCommand(Session session, String command)
      throws Exception {
    ChannelExec channel = (ChannelExec) session.openChannel("exec");
    channel.setCommand(command);
    channel.setInputStream(null);
    channel.setErrStream(System.err);
    channel.connect();

    InputStream in = channel.getInputStream();

    BufferedReader br = new BufferedReader(new InputStreamReader(in));
    String line;
    StringBuffer sb = new StringBuffer();
    while ((line = br.readLine()) != null) {
      sb.append(line + '\n');
    }
    channel.disconnect();

    return sb.toString();
  }
}
