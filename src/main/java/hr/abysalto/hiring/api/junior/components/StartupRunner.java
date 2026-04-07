package hr.abysalto.hiring.api.junior.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupRunner implements CommandLineRunner {

    @Autowired
    private DatabaseInitializer databaseInitializer;

    @Override
    public void run(String... args) throws Exception {
        databaseInitializer.initialize();
    }
}
