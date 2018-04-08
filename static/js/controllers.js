
'use strict';

/* Use JQuery.gritter to popup success message */
function alert_success(message) {
  $.gritter.add({
    title: 'Success!',
    text: message,
    image: 'static/img/seagull-logo.png',
    time: 3000
  });
}

/* Use JQuery.gritter to popup error message */
function alert_error(message) {
  $.gritter.add({
    title: 'Error!',
    text: message,
    image: 'static/img/seagull-logo.png',
    time: 3000
  });
}

/* All angular application controllers */
var seagullControllers = angular.module('seagullControllers', []);

/* This controller to get comment from beego api */
seagullControllers.controller('HomeController',
  function($scope, $rootScope, $routeParams, version, info) {

  $scope.version = version;
  $scope.Os = $scope.version.Os;
  $scope.KernelVersion = $scope.version.KernelVersion;
  $scope.GoVersion = $scope.version.GoVersion;
  $scope.Version = $scope.version.Version;

  $scope.info = info;
  $scope.Containers = $scope.info.Containers;
  $scope.Images = $scope.info.Images;
});

/* Contaienrs controller requests beego API server to get/start/stop/delete containers */
seagullControllers.controller('ContainersController',
  function($scope, $rootScope, $routeParams, $http, $cookies, allContainers, runningContainers) {

  $scope.predicate = '';
  $scope.reverse = false;

  /* Refer to https://docs.docker.com/reference/api/docker_remote_api_v1.14/#list-containers
    [{
      "Id": "d0bd54b5889f73ced793007ecdb3a1f923b3bc6d47979e9b24a8c7f1906aee5a", // I edit it
      "Names": ["/happy_turing"] // I add it
      "Image": "base:latest",
      "Command": "echo 1",
      "Created": 1367854155,
      "Status": "Exit 0",
      "Ports":[{"PrivatePort": 2222, "PublicPort": 3333, "Type": "tcp"}],
    }]
  */

  /* For the first time, display all containers by default */
  if (typeof $cookies.isAllContainers === "undefined") {
    $cookies.isAllContainers = "true"; // Only string data in cookies
  }

  /* Check cookies and get all or running container objects */
  if ($cookies.isAllContainers === "true") {
    $scope.currentFilterString = "All";
    $scope.isAllContainers = true;
    $scope.containers = allContainers;
  } else {
    $scope.currentFilterString = "Running";
    $scope.isAllContainers = false;
    $scope.containers = runningContainers;
  }

  /* Get all containers objects */
  $scope.getAllContainers = function() {
    $http.get($rootScope.canonicalServer + '/containers/json?all=1').success(function(data) {
      $scope.currentFilterString = "All";
      $scope.isAllContainers = true;
      $cookies.isAllContainers = "true";
      $scope.containers = data;
      alert_success("Get all containers");
    });
  };

  /* Get running containers objects */
  $scope.getRunningContainers = function() {
    $http.get($rootScope.canonicalServer + '/containers/json?all=0').success(function(data) {
      $scope.currentFilterString = "Running";
      $scope.isAllContainers = false;
      $cookies.isAllContainers = "no";
      $scope.containers = data;
      alert_success("Get running containers");
    });
  };

  /* Enable to check startsWith, refer to http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string */
  if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str){
      return this.indexOf(str) == 0;
    };
  };

  /* Determine if the container is running */
  $scope.checkRunning = function(container) {
    if (container.Status.startsWith("Up")) {
      return true;
    } else {
      return false;
    }
  };

  /* Ports: [
      {
        PrivatePort: 16000,
        Type: "tcp"
      },
      {
        PrivatePort: 16010,
        Type: "tcp"
      },
      {
        PrivatePort: 16020,
        Type: "tcp"
      },
      {
        PrivatePort: 16030,
        Type: "tcp"
      },
      {
        IP: "0.0.0.0",
        PrivatePort: 5000,
        PublicPort: 5000,
        Type: "tcp"
      }
    ]
  */

  /* Print ports in better way */
  $scope.printPorts = function(data) {
    var returnString = "";
    for(var i = 0; i < data.length; i++) {
      var object = data[i];
      if (object["IP"]) {
        returnString += object.IP + ":" + object.PublicPort + "->" + object.PrivatePort + "/" + object.Type;
      } else {
        returnString += object.PrivatePort + "/" + object.Type;
      }

      if (i != data.length-1) {
        returnString += ", ";
      }
    }

    return returnString;
  }

  /* Request beego API server to start container */
  $scope.startContainer = function(id) {
    $http({
      method: 'POST',
      url: $rootScope.canonicalServer + '/containers/' + id + "/start",
      data: '',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      if (status == 200) {
        alert_success("Start container " + id.substring(0,12));
        $http.get($rootScope.canonicalServer + '/containers/json?all=1').success(function(data) {
          $scope.containers = data;
        });
      } else {
        alert_error("Start container " + id.substring(0,12));
      }
    }).error(function(data, status, headers, config) {
      alert_error("Start container " + id.substring(0,12));
    });
  };

  /* Request beego API server to stop container */
  $scope.stopContainer = function(id) {
    $http({
      method: 'POST',
      url: $rootScope.canonicalServer + '/containers/' + id + "/stop",
      data: '',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      if (status == 200) {
        alert_success("Stop container " + id.substring(0,12));
        $http.get($rootScope.canonicalServer + '/containers/json?all=1').success(function(data) {
          $scope.containers = data;
        });
      } else {
        alert_error("Stop container " + id.substring(0,12));
      }
    }).error(function(data, status, headers, config) {
      alert_error("Stop container " + id.substring(0,12));
    });
  };

  /* Request beego API server to delete container */
  $scope.deleteContainer = function(id) {
    $http({
      method: 'DELETE',
      url: $rootScope.canonicalServer + '/containers/' + id,
      data: '',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      if (status == 200) {
        alert_success("Delete container " + id.substring(0,12));
        $http.get($rootScope.canonicalServer + '/containers/json?all=1').success(function(data) {
          $scope.containers = data;
        });
      } else {
        alert_error("Delete container " + id.substring(0,12));
      }
    }).error(function(data, status, headers, config) {
      alert_error("Delete container " + id.substring(0,12));
    });
  };

});

/*
 * Contaienr controller requests beego API server to get/start/stop/delete container
 * Todo: Remove the duplicated code from ContainersController
 */
seagullControllers.controller('ContainerController', ['$scope', '$rootScope', '$routeParams', '$http',
  function($scope, $rootScope, $routeParams, $http) {


  /* Get the container object */
  $http.get($rootScope.canonicalServer + '/containers/' + $routeParams.id + '/json').success(function(data) {
    $scope.container = data;
  });

  /* Get the container top status */
  $http.get($rootScope.canonicalServer + '/containers/' + $routeParams.id + '/top').success(function(data) {
    $scope.top = data;
  });

  /* Get the container stats */
  $http.get($rootScope.canonicalServer + '/containers/' + $routeParams.id + '/stats').success(function(data) {
    $scope.stats = data;
  });

  /* Refresh the page */
  $scope.refresh = function() {
    location.reload();
  };

  /* Request beego API server to start container */
  $scope.startContainer = function(id) {
    $http({
      method: 'POST',
      url: $rootScope.canonicalServer + '/containers/' + id + "/start",
      data: '',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      if (status == 200) {
        alert_success("Start container " + id.substring(0,12));
        $http.get($rootScope.canonicalServer + '/containers/' + $routeParams.id + '/json').success(function(data) {
          $scope.container = data;
        });

        $http.get($rootScope.canonicalServer + '/containers/' + $routeParams.id + '/top').success(function(data) {
          $scope.top = data;
        });
      } else {
        alert_error("Start container " + id.substring(0,12));
      }
    }).error(function(data, status, headers, config) {
      alert_error("Start container " + id.substring(0,12));
    });
  };

  /* Request beego API server to stop container */
  $scope.stopContainer = function(id) {
    $http({
      method: 'POST',
      url: $rootScope.canonicalServer + '/containers/' + id + "/stop",
      data: '',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      if (status == 200) {
        alert_success("Stop container " + id.substring(0,12));
        $http.get($rootScope.canonicalServer + '/containers/' + $routeParams.id + '/json').success(function(data) {
          $scope.container = data;
        });

        $http.get($rootScope.canonicalServer + '/containers/' + $routeParams.id + '/top').success(function(data) {
          $scope.top = data;
        });
      } else {
        alert_error("Stop container " + id.substring(0,12));
      }
    }).error(function(data, status, headers, config) {
      alert_error("Stop container " + id.substring(0,12));
    });
  };

  /* Request beego API server to delete container */
  $scope.deleteContainer = function(id) {
    $http({
      method: 'DELETE',
      url: $rootScope.canonicalServer + '/containers/' + id,
      data: '',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      if (status == 200) {
        alert_success("Delete container " + id.substring(0,12));
        $http.get($rootScope.canonicalServer + '/containers/' + $routeParams.id + '/json').success(function(data) {
          $scope.container = data;
        });

        $http.get($rootScope.canonicalServer + '/containers/' + $routeParams.id + '/top').success(function(data) {
          $scope.top = data;
        });
      } else {
        alert_error("Delete container " + id.substring(0,12));
      }
    }).error(function(data, status, headers, config) {
      alert_error("Delete container " + id.substring(0,12));
    });
  };

}]);

/* Images controller requests beego API server to get/delete images */
seagullControllers.controller('ImagesController',
  function($scope, $rootScope, $routeParams, $http, images) {


  // Sort table, refer to https://docs.angularjs.org/api/ng/filter/orderBy
  $scope.predicate = '';
  $scope.reverse = false;

  /* Remove image id prefix from "sha256:7b550cc136fa992081e4ee02f8afbd17087ad9921ccedf0409ff7807c990643d" to "7b550cc136fa992081e4ee02f8afbd17087ad9921ccedf0409ff7807c990643d" */
  for (var i=0; i < images.length; i++) {
    images[i].Id = images[i].Id.substring(7)
  }

  $scope.images = images;

  /* Request beego API server to delete image */
  $scope.deleteImage = function(id) {
    $http({
      method: 'DELETE',
      url: $rootScope.canonicalServer + '/images/' + id,
      data: '',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      if (status == 200) {
        alert_success("Delete image " + id.substring(0,12));
        $http.get($rootScope.canonicalServer + '/images/json').success(function(images) {

          /* Remove image id prefix from "sha256:7b550cc136fa992081e4ee02f8afbd17087ad9921ccedf0409ff7807c990643d" to "7b550cc136fa992081e4ee02f8afbd17087ad9921ccedf0409ff7807c990643d" */
          for (var i=0; i < images.length; i++) {
            images[i].Id = images[i].Id.substring(7)
          }

          $scope.images = images;
        });
      } else {
        alert_error("Delete image " + id.substring(0,12));
      }
    }).error(function(data, status, headers, config) {
      alert_error("Delete image " + id.substring(0,12));
    });
  };
});

/*
 * Image controller requests beego API server to get image
 * Todo: Remove the duplicated code from ImagesController
 */
seagullControllers.controller('ImageController',
  function($scope, $rootScope, $routeParams, image) {

  /* Remove image id prefix from "sha256:7b550cc136fa992081e4ee02f8afbd17087ad9921ccedf0409ff7807c990643d" to "7b550cc136fa992081e4ee02f8afbd17087ad9921ccedf0409ff7807c990643d" */
  image.Id = image.Id.substring(7)

  $scope.image = image;
});

/* Contaienrs controller requests beego API server to get configuration */
seagullControllers.controller('ConfigurationController',
  function($scope, $rootScope, $routeParams, $http, version, info) {

  $scope.version = version;
  $scope.info = info;

});

/* Make it for TiDB Monitor dashboard */

seagullControllers.controller('TiBDStatusController',
  function($scope, $rootScope, $routeParams, $http, tistatus) {

  // Sort table, refer to https://docs.angularjs.org/api/ng/filter/orderBy
  $scope.predicate = '';
  $scope.reverse = false;

  $scope.tistatus = tistatus;

});


seagullControllers.controller('TiBDSchemaController',
  function($scope, $rootScope, $routeParams, $http, schemas) {

  // Sort table, refer to https://docs.angularjs.org/api/ng/filter/orderBy
  $scope.predicate = '';
  $scope.reverse = false;
		
  $scope.schemas = schemas;

});


seagullControllers.controller('TiBDTalbesController',
  function($scope, $rootScope, $routeParams, $http, tables) {

  // Sort table, refer to https://docs.angularjs.org/api/ng/filter/orderBy
  $scope.predicate = '';
  $scope.reverse = false;

  $scope.tables = tables;

});


seagullControllers.controller('TiBDTalbeController',
  function($scope, $rootScope, $routeParams, $http, table) {

  // Sort table, refer to https://docs.angularjs.org/api/ng/filter/orderBy
  $scope.predicate = '';
  $scope.reverse = false;

  $scope.table = table;

});

seagullControllers.controller('TiBDSettingController',
  function($scope, $rootScope, $routeParams, $http, setting) {

  // Sort table, refer to https://docs.angularjs.org/api/ng/filter/orderBy
  $scope.predicate = '';
  $scope.reverse = false;

  $scope.setting = setting;

});

/* Stores controller requests beego API server to get stores */
seagullControllers.controller('StoresController',
  function($scope, $rootScope, $routeParams, $http, stores) {

  // Sort table, refer to https://docs.angularjs.org/api/ng/filter/orderBy
  $scope.predicate = '';
  $scope.reverse = false;

  $scope.stores = stores.stores;

});

/* Store controller requests beego API server to get store by id */
seagullControllers.controller('StoreController',
  function($scope, $rootScope, $routeParams, store) {

  $scope.store = store;
});

function hexToString (hex) {
	var hex = hex.toString();//force conversion
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
}

/* Regions controller requests beego API server to get regions */
seagullControllers.controller('RegionsController',
  function($scope, $rootScope, $routeParams, $http, regions) {

  // Sort table, refer to https://docs.angularjs.org/api/ng/filter/orderBy
  $scope.predicate = regions.regions.id;
  $scope.reverse = false;

  /* replace string */
  for (var i=0; i < regions.regions.length; i++) {
    regions.regions[i].start_key = (regions.regions[i].start_key.replace(/\\x/g,'')).substring(8)
	regions.regions[i].end_key = (regions.regions[i].end_key.replace(/\\x/g,'')).substring(8)
  }

  $scope.regions = regions.regions;

});

/* Region controller requests beego API server to get region by id */
seagullControllers.controller('RegionController',
  function($scope, $rootScope, $routeParams, region) {

  $scope.region = region;
});

/* Members controller requests beego API server to get members */
seagullControllers.controller('MembersController',
  function($scope, $rootScope, $routeParams, $http, members) {

  // Sort table, refer to https://docs.angularjs.org/api/ng/filter/orderBy
  $scope.predicate = members.members.name;
  $scope.reverse = false;

  $scope.members = members.members;
  $scope.leader = members.leader;
  $scope.etcd_leader = members.etcd_leader;

});

/* Configure controller requests beego API server to get configure */
seagullControllers.controller('ConfigController',
  function($scope, $rootScope, $routeParams, config) {

  $scope.config = config;
});

/* Dockerhub controller requests beego API server to get search images */
seagullControllers.controller('DockerhubController',
  function($scope, $rootScope, $routeParams, $http, images) {

  /*
    [{
      description: "Friendly Web UI to monitor docker daemon",
      is_official: false,
      is_trusted: true,
      name: "tobegit3hub/seagull",
      star_count: 1
    }]
  */

  $scope.images = images;

  /* Request beego API server to get search images */
  $scope.getSearchImages = function(term) {
    $scope.isSearching = true;

    $http.get($rootScope.canonicalServer + '/images/search?term=' + term).success(function(data) {
      $scope.isSearching = false;
      $scope.images = data;
      alert_success("Search images of " + term);
    }).error(function(data, status, headers, config) {
      $scope.isSearching = false;
      alert_error("Search images of " + term);
    });
  };

  /* Generate the image link by judging it's official images or not */
  $scope.getImageLink = function(name) {
    var address;

    if(name.indexOf('/') === -1) {
      // Example: https://registry.hub.docker.com/_/golang
      address = "https://registry.hub.docker.com/_/" + name;
    } else {
      // Example: https://registry.hub.docker.com/u/tobegit3hub/seagull
      address = "https://registry.hub.docker.com/u/" + name;
    }

    return address;
  };
});
