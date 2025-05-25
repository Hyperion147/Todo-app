package main

import (
	"Todo-app/router"
	"fmt"
	"log"
	"net/http"
)

func main() {
	r := router.Router()
	fmt.Println("Starting the server on port 6969")

	log.Fatal(http.ListenAndServe(":6969", r))
}
