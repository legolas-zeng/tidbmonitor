package controllers

/*
 * The docker API controller to access docker unix socket and reponse JSON data
 *
 * Refer to https://docs.docker.com/reference/api/docker_remote_api_v1.14/ for docker remote API
 * Refer to https://github.com/Soulou/curl-unix-socket to know how to access unix docket
 */

import (
	"fmt"
	"io/ioutil"
	"log"

	"net/http"
	"strings"

	"github.com/astaxie/beego"
	"github.com/pingcap/tidbmonitor/models"
)

/* Give address and method to request docker unix socket */
func HttpRequest(address, method string) string {

	reader := strings.NewReader("")

	request, err := http.NewRequest(method, address, reader)
	if err != nil {
		fmt.Println("Error to create http request", err)
		return ""
	}

	//client := httputil.NewClientConn(conn, nil)
	client := &http.Client{}

	response, err := client.Do(request)
	if err != nil {
		fmt.Println("Error to achieve http request over unix socket", err)
		return ""
	}

	if response.Status != "200 OK" {
		log.Fatal("Server reports status: ", response.Status)
		fmt.Println("Server reports status: ", response.Status)
		return ""
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Println("Error, get invalid body in answer")
		return ""
	}

	defer response.Body.Close()

	return string(body)
}

func HttpPDRequest(address, method string) string {

	Conf, _ := models.GetTiDBHost()

	PD_ADDR := "http://" + Conf.PDip + ":" + Conf.PDport

	// Example: http://127.0.0.1:2379/pd/api/v1/stores
	pd_obj_url := PD_ADDR + address

	fmt.Println(" PD URI: ", pd_obj_url)

	return HttpRequest(pd_obj_url, method)
}

func HttpTiDBRequest(address, method string) string {

	Conf, _ := models.GetTiDBHost()

	TiDB_ADDR := "http://" + Conf.Tidbip + ":" + Conf.Tidbport

	pd_obj_url := TiDB_ADDR + address

	fmt.Println(" TIDB URI: ", pd_obj_url)
	return HttpRequest(pd_obj_url, method)
}

/* It's a beego controller */
type TiDBapiController struct {
	beego.Controller
}

/*get tikv stores information. */
func (this *TiDBapiController) Getstores() {
	address := "/pd/api/v1/stores"
	result := HttpPDRequest(address, "GET")

	this.Ctx.WriteString(result)
}

/*get tikv store id information. */
func (this *TiDBapiController) Getstore() {
	id := this.GetString(":id")
	address := "/pd/api/v1/store/" + id
	result := HttpPDRequest(address, "GET")

	this.Ctx.WriteString(result)
}

/*get tikv regions information. */
func (this *TiDBapiController) Getregions() {
	address := "/pd/api/v1/regions"
	result := HttpPDRequest(address, "GET")

	this.Ctx.WriteString(result)
}

/*get tikv region id information. */
func (this *TiDBapiController) Getregion() {
	id := this.GetString(":id")
	address := "/pd/api/v1/region/id/" + id
	result := HttpPDRequest(address, "GET")

	this.Ctx.WriteString(result)
}

/*get pd member information. */
func (this *TiDBapiController) Getmembers() {
	address := "/pd/api/v1/members"
	result := HttpPDRequest(address, "GET")

	this.Ctx.WriteString(result)
}

/*get pd config information. */
func (this *TiDBapiController) Getconfig() {
	address := "/pd/api/v1/config"
	result := HttpPDRequest(address, "GET")

	this.Ctx.WriteString(result)
}

/*========================================== */

/*get GetTidbStatus information. */
func (this *TiDBapiController) GetTidbStatus() {
	address := "/status"
	result := HttpTiDBRequest(address, "GET")

	//	fmt.Println("Server result: ", result)
	this.Ctx.WriteString(result)
}

/*get GetTidbSchema information. */
func (this *TiDBapiController) GetTidbSchema() {
	address := "/schema"
	result := HttpTiDBRequest(address, "GET")

	this.Ctx.WriteString(result)
}

/*get GetTidbdb information. */
func (this *TiDBapiController) GetTidbTables() {
	db := this.GetString(":db")
	address := "/schema/" + db

	result := HttpTiDBRequest(address, "GET")

	this.Ctx.WriteString(result)
}

/*get GetTidbTable information. */
func (this *TiDBapiController) GetTidbTable() {
	db := this.GetString(":db")
	table := this.GetString(":table")
	address := "/schema/" + db + "/" + table

	result := HttpTiDBRequest(address, "GET")

	this.Ctx.WriteString(result)
}

/*get GetTidbSetting information. */
func (this *TiDBapiController) GetTidbSetting() {
	address := "/settings"
	result := HttpTiDBRequest(address, "GET")

	this.Ctx.WriteString(result)
}
