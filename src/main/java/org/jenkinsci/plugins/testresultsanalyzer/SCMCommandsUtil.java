package org.jenkinsci.plugins.testresultsanalyzer;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
public final class SCMCommandsUtil{
	private SCMCommandsUtil(){
	
	}
	public static String getFileURL(String fileName, String revisionFile){
		try{
            String retVal = readFile(revisionFile);
            int lastSlash = retVal.lastIndexOf("/");
            String url = retVal.substring(0,lastSlash+1);
            int bestMerge = -1;
            for (int i = 0; i <= url.length() && i <= fileName.length(); i++){
                if (fileName.substring(0,i).equals(url.substring(url.length()- i, url.length())))
                    bestMerge = i;
            }
            return url + fileName.substring(bestMerge,fileName.length()) + "@" + retVal.substring(lastSlash+1,retVal.length()-1);
        }
        catch(IOException e){
            return null;
        }

	}
    public static String runCommand(String command){
        Runtime rt = Runtime.getRuntime();
		String output = "";
        try{
            Process p = rt.exec(command);
            BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String s;
            while ((s = stdInput.readLine()) != null) {
                output += s + "\n";
            }
        }
        catch(IOException e){
			return "Error reading from stdin";
        }
		return output;

    }
	public static String readFile(String fileName) throws IOException {
		BufferedReader br = new BufferedReader(new FileReader(fileName));
		try {
			StringBuilder sb = new StringBuilder();
			String line = br.readLine();

			while (line != null) {
				sb.append(line);
				sb.append("\n");
				line = br.readLine();
			}
			return sb.toString();
		} finally {
			br.close();
		}
	}
}
