package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Hyperion147/Todo-app/router"
)

func main() {
	r := router.Router()

	fmt.Println("Starting the server on port 7900")
	log.Fatal(http.ListenAndServe(":7900", r))
}
