package de.eseidinger.alpha_shapes_web;

import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("alphashape.svg")
@Singleton
public class AlphaShapeSvgService {
    
    private String svg = "";

    @PUT
    @Consumes(MediaType.APPLICATION_SVG_XML)
    public void putSvg(String svg) {
        this.svg = svg;
    }
    
    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public String getSvg() {
        return this.svg;
    }
}
