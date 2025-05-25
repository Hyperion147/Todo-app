package main

import (
	"fmt"
	"log"
	"net/http"

	"./router"
)

func main() {
	r := router.Router()
	fmt.Println("Starting the server on port 6969")

	log.Fatal(http.ListenAndServe(":6969", r))
}
