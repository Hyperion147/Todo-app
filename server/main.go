package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Hyperion147/Todo-app/router"
	"go.mongodb.org/mongo-driver/mongo"
)

func main() {
	var client *mongo.Client 
	db := client.Database(os.Getenv("DB_NAME"))
	r := router.Router(db)

	fmt.Println("Starting the server on port 7900")
	log.Fatal(http.ListenAndServe(":7900", r))
}
