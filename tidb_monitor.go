package main

import (
	"github.com/astaxie/beego"
	"github.com/pingcap/tidbmonitor/models"
	_ "github.com/pingcap/tidbmonitor/routers"
)

/* The main function of beego application */
func main() {
	// Build the binary to run web server
	models.Init()
	beego.Run()
}
