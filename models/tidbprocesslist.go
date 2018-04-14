/**********************************************
** @Des: This file ...
** @Author: haodaquan
** @Date:   2017-09-16 15:42:43
** @Last Modified by:   haodaquan
** @Last Modified time: 2017-09-25 11:48:17
***********************************************/
package models

import (
	"fmt"

	"github.com/astaxie/beego/orm"
)

type ProcessList struct {
	Id      int
	User    string
	Host    string
	Db      string
	Command int
	Time    int
	State   int
	Info    string
	Mem     string
}

func GetTidbProcessList() ([]*ProcessList, error) {
	list := make([]*ProcessList, 0)
	sql := "show processlist"

	orm.NewOrm().Raw(sql).QueryRows(&list)

	fmt.Println("TiDB reponse: ", &list)
	return list, nil
}
