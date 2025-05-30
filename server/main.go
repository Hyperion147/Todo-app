
package main

import (
	"log"
	"net/http"

	"github.com/Hyperion147/Todo-app/config"
	"github.com/Hyperion147/Todo-app/database"
	"github.com/Hyperion147/Todo-app/router"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := database.NewMongoDB(cfg.DBURI, cfg.DBName)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	r := router.Router(db.DB, cfg)

	log.Println("Starting server on :7900")
	if err := http.ListenAndServe(":7900", r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}