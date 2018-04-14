/**********************************************
** @Des: This file ...
** @Author: haodaquan
** @Date:   2017-09-16 15:42:43
** @Last Modified by:   haodaquan
** @Last Modified time: 2017-09-25 11:48:17
***********************************************/
package models

import (
	"github.com/astaxie/beego"
)

// *****************************************************************************
// Application Settings
// *****************************************************************************

// configuration contains the application settings
type Tidbconf struct {
	PDip     string
	PDport   string
	Tidbip   string
	Tidbport string
}

func GetTiDBHost() (*Tidbconf, error) {
	c := new(Tidbconf)

	c.PDip = beego.AppConfig.String("pdip")
	c.PDport = beego.AppConfig.String("pdport")
	c.Tidbip = beego.AppConfig.String("tidbip")
	c.Tidbport = beego.AppConfig.String("tidbport")

	return c, nil
}
