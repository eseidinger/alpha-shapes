package de.eseidinger.alpha_shapes;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by Emanuel Seidinger on 30.11.13.
 */
public class AlphaShapesSvgServiceTest {

    private MockMvc mockMvc;

    @Before
    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(new AlphaShapesSvgService()).build();
    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void testGetSvg() throws Exception {
        mockMvc.perform(put("/resources/alphashape.svg").content("test"));
        mockMvc.perform(get("/resources/alphashape.svg").accept(MediaType.APPLICATION_OCTET_STREAM)).
                andExpect(status().isOk()).
                andExpect(content().string("test"));
    }
}
