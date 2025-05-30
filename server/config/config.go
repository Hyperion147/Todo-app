package config

import (
    "os"
    "time"

	"github.com/joho/godotenv"
)

type Config struct {
	DBURI string
	DBName string
	JWTSecret string
	JWTExpiration time.Duration
	SetupToken string
}

func Load() (*Config, error){
	if err := godotenv.Load()
	err != nil {
		return nil, err
	}

	jwtExp, err := time.ParseDuration(os.Getenv("JWT_EXPIRATION"))
	if err != nil {
		jwtExp = 24 * time.Hour
	}

	return &Config{
		DBURI: os.Getenv(("DB_URI")),
		DBName: os.Getenv(("DB_NAME")),
		JWTSecret: os.Getenv(("DB_SECRET_KEY")),
		JWTExpiration: jwtExp,
		SetupToken: os.Getenv(("SETUP_TOKEN")),
	}, nil
}