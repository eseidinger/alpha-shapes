package de.eseidinger.alpha_shapes_web;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.CharBuffer;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

@Path("points.json")
@Singleton
public class PointsJsonService {

    private String points = "";

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void putPoints(String points) {
        this.points = points;
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public void uploadPoints(@FormDataParam("pointsFile") InputStream file,
                            @FormDataParam("pointsFile") FormDataContentDisposition fileDetails) {
        CharBuffer charBuffer = CharBuffer.allocate(1_000_000);
        StringBuilder strBuilder = new StringBuilder();
        try {
            Reader reader = new BufferedReader(new InputStreamReader(file,"UTF-8"));
            while (reader.read(charBuffer) != -1) {
                charBuffer.flip();
                strBuilder.append(charBuffer);
                charBuffer.clear();
            }
        } catch (IOException ex) {
            Logger.getLogger(PointsJsonService.class.getName()).log(Level.SEVERE, null, ex);
        }
        this.points = strBuilder.toString();
    }


    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public String getPoints() {
        return this.points;
    }
}
