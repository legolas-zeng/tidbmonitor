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

	beego.Router("/containers", &controllers.MainController{})
	beego.Router("/containers/:id", &controllers.MainController{})
	beego.Router("/images", &controllers.MainController{})
	beego.Router("/images/:id", &controllers.MainController{})
	beego.Router("/images/:user/:repo", &controllers.MainController{})
	beego.Router("/configuration", &controllers.MainController{})
	beego.Router("/dockerhub", &controllers.MainController{})

	/* HTTP API for docker remote API */
	beego.Router("/dockerapi/containers/json", &controllers.DockerapiController{}, "get:GetContainers")
	beego.Router("/dockerapi/containers/:id/json", &controllers.DockerapiController{}, "get:GetContainer")
	beego.Router("/dockerapi/containers/:id/top", &controllers.DockerapiController{}, "get:TopContainer")
	beego.Router("/dockerapi/containers/:id/start", &controllers.DockerapiController{}, "post:StartContainer")
	beego.Router("/dockerapi/containers/:id/stop", &controllers.DockerapiController{}, "post:StopContainer")
	beego.Router("/dockerapi/containers/:id", &controllers.DockerapiController{}, "delete:DeleteContainer")
	beego.Router("/dockerapi/containers/:id/stats", &controllers.DockerapiController{}, "get:GetContainerStats")
	beego.Router("/dockerapi/images/json", &controllers.DockerapiController{}, "get:GetImages")
	beego.Router("/dockerapi/images/:id/json", &controllers.DockerapiController{}, "get:GetImage")
	beego.Router("/dockerapi/images/:user/:repo/json", &controllers.DockerapiController{}, "get:GetUserImage")
	beego.Router("/dockerapi/images/:id", &controllers.DockerapiController{}, "delete:DeleteImage")
	beego.Router("/dockerapi/version", &controllers.DockerapiController{}, "get:GetVersion")
	beego.Router("/dockerapi/info", &controllers.DockerapiController{}, "get:GetInfo")
	beego.Router("/dockerapi/images/search", &controllers.DockerapiController{}, "get:GetSearchImages")

	/* HTTP API for tidb remote API */
	beego.Router("/tistatus", &controllers.MainController{})
	beego.Router("/schema", &controllers.MainController{})
	beego.Router("/schema/:db", &controllers.MainController{})
	beego.Router("/schema/:db/:table", &controllers.MainController{})

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

	beego.Router("/dockerapi/stores/json", &controllers.TiDBapiController{}, "get:Getstores")
	beego.Router("/dockerapi/store/:id/json", &controllers.TiDBapiController{}, "get:Getstore")
	beego.Router("/dockerapi/regions/json", &controllers.TiDBapiController{}, "get:Getregions")
	beego.Router("/dockerapi/region/:id/json", &controllers.TiDBapiController{}, "get:Getregion")

	beego.Router("/dockerapi/members/json", &controllers.TiDBapiController{}, "get:Getmembers")
	beego.Router("/dockerapi/config/json", &controllers.TiDBapiController{}, "get:Getconfig")
	beego.Router("/dockerapi/tidbsetting/json", &controllers.TiDBapiController{}, "get:GetTidbSetting")

	beego.Router("/dockerapi/_ping", &controllers.DockerapiController{}, "get:Ping")
}
