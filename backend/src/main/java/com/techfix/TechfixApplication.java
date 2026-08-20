package com.techfix;

import org.flywaydb.core.Flyway;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

@SpringBootApplication
public class TechfixApplication {

	public static void main(String[] args) {
        createDatabaseIfNotExist();
        runFlyway();
		SpringApplication.run(TechfixApplication.class, args);
	}

    private static void runFlyway() {
        String host = getEnvOrDefault("DB_HOST", "localhost");
        String port = getEnvOrDefault("DB_PORT", "5432");
        String user = getEnvOrDefault("DB_USER", "postgres");
        String password = getEnvOrDefault("DB_PASSWORD", "postgres");
        String dbName = getEnvOrDefault("DB_NAME", "techfix");

        String url = "jdbc:postgresql://" + host + ":" + port + "/" + dbName;

        System.out.println("\n =============== RODANDO MIGRATIONS ====================");

        try {
            Flyway flyway = Flyway.configure()
                    .dataSource(url, user, password)
                    .locations("classpath:db/migration")
                    .baselineOnMigrate(true)
                    .load();

            flyway.migrate();
            System.out.println("MIGRATIONS APLICADAS COM SUCESSO!");
        } catch (Exception e) {
            System.err.println("ERRO NO FLYWAY: " + e.getMessage());
        }
        System.out.println("=========================================================\n");
    }

    private static void createDatabaseIfNotExist() {
        // Lendo variáveis de ambiente com fallback para os valores default
        String host = getEnvOrDefault("DB_HOST", "localhost");
        String port = getEnvOrDefault("DB_PORT", "5432");
        String user = getEnvOrDefault("DB_USER", "postgres");
        String password = getEnvOrDefault("DB_PASSWORD", "postgres");
        String dbName = getEnvOrDefault("DB_NAME", "techfix");

        // connection URL
        String url = "jdbc:postgresql://" + host + ":" + port + "/postgres";

        try (Connection connection = DriverManager.getConnection(url, user, password);
             Statement statement = connection.createStatement()) {

            // checks if there's already a db with the given name
            ResultSet resultSet = statement.executeQuery("SELECT count(*) FROM pg_database WHERE datname = '" + dbName + "'");

            if (resultSet.next() && resultSet.getInt(1) == 0) {
                //if db doesnt exists, creates it
                statement.executeUpdate("CREATE DATABASE " + dbName);
                System.out.println("Banco de dados '" + dbName + "' criado !!");
            } else {
                System.out.println("Banco de dados '" + dbName + "' já existente. Seguindo com o spring");
            }

        } catch (Exception e) {
            System.err.println("Não foi possível criar o banco de dados código. " + e.getMessage());
        }
    }

    // method to get the env value or set default
    private static String getEnvOrDefault(String envName, String defaultValue) {
        String value = System.getenv(envName);
        return (value != null && !value.isBlank()) ? value : defaultValue;
    }
}
