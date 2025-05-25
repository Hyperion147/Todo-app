package main

import (
	"fmt"
	"log"

	"github.com/Hyperion147/Todo-app/router"
	"github.com/Hyperion147/net/http"
)

func main() {
	r := router.Router()
	fmt.Println("Starting the server on port 6969")

	log.Fatal(http.ListenAndServe(":6969", r))
}
