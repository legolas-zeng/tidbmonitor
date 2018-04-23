package routers

import (
	"github.com/astaxie/beego"
	"github.com/pingcap/tidbmonitor/controllers"
)

func init() {
	/* Pass to Angular router */
	beego.Router("/", &controllers.MainController{})

	beego.Router("/login", &controllers.MainController{})
	beego.Router("/loginout", &controllers.MainController{})
	beego.Router("/about", &controllers.MainController{})

	/* HTTP API for tidb remote API */
	beego.Router("/tistatus", &controllers.MainController{})
	beego.Router("/schema", &controllers.MainController{})
	beego.Router("/schema/:db", &controllers.MainController{})
	beego.Router("/schema/:db/:table", &controllers.MainController{})
	beego.Router("/tables/:db/:table/disk-usage", &controllers.MainController{})
	beego.Router("/tables/:db/:table/regions", &controllers.MainController{})

	beego.Router("/stores", &controllers.MainController{})
	beego.Router("/store/:id", &controllers.MainController{})
	beego.Router("/regions", &controllers.MainController{})
	beego.Router("/region/:id", &controllers.MainController{})

	beego.Router("/members", &controllers.MainController{})
	beego.Router("/config", &controllers.MainController{})
	beego.Router("/tidbsetting", &controllers.MainController{})

	beego.Router("/dockerapi/tistatus/json", &controllers.TiDBapiController{}, "get:GetTidbStatus")
	beego.Router("/dockerapi/schema/json", &controllers.TiDBapiController{}, "get:GetTidbSchema")
	beego.Router("/dockerapi/schema/:db/json", &controllers.TiDBapiController{}, "get:GetTidbTables")
	beego.Router("/dockerapi/schema/:db/:table/json", &controllers.TiDBapiController{}, "get:GetTidbTable")
	beego.Router("/dockerapi/tables/:db/:table/disk-usage/json", &controllers.TiDBapiController{}, "get:GetTidbTableDiskusage")
	beego.Router("/dockerapi/tables/:db/:table/regions/json", &controllers.TiDBapiController{}, "get:GetTidbTableRegions")

	beego.Router("/dockerapi/stores/json", &controllers.TiDBapiController{}, "get:Getstores")
	beego.Router("/dockerapi/store/:id/json", &controllers.TiDBapiController{}, "get:Getstore")
	beego.Router("/dockerapi/regions/json", &controllers.TiDBapiController{}, "get:Getregions")
	beego.Router("/dockerapi/region/:id/json", &controllers.TiDBapiController{}, "get:Getregion")

	beego.Router("/dockerapi/members/json", &controllers.TiDBapiController{}, "get:Getmembers")
	beego.Router("/dockerapi/config/json", &controllers.TiDBapiController{}, "get:Getconfig")
	beego.Router("/dockerapi/tidbsetting/json", &controllers.TiDBapiController{}, "get:GetTidbSetting")

	beego.Router("/dockerapi/_ping", &controllers.DockerapiController{}, "get:Ping")
}
