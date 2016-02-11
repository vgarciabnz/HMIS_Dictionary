var HmisReport = angular.module('HmisReportCtrl',['ngSanitize','pascalprecht.translate','ui.tinymce']);

HmisReport.controller('HmisReportCtrl', ['$scope', '$rootScope','DataSets', 'DataSet', 'Elements', 'DossierValue', 'Indicators', 'IndicatorGrps','IndicatorGrp', 'Sections', function($scope, $rootScope, DataSets, DataSet, Elements, DossierValue, Indicators, IndicatorGrps, IndicatorGrp, Sections){
	$scope.hmisTitle = '';
	//$scope.elementGroups = ElementsGrps.get();
	$scope.dataSets = DataSets.get();
	$scope.indicatorGrps = IndicatorGrps.get();
	//console.log($scope.indicatorGrps.indicatorGroups.length);

	$scope.getDataSectionsAndDossierText = function(){
		$scope.dataset = DataSet.get({dataSetId:$scope.selectedSet.id});
		$scope.sections = Sections.get();
		$scope.dataSetCodeWithoutNumber = removeLevelOfDataSetCode($scope.selectedSet.code);
		$scope.dossierRow = DossierValue.get({dataSetCode:$scope.dataSetCodeWithoutNumber});	
		//$scope.indicators = Indicators.get({dataSetName:$scope.selectedSet.displayName});
	};

	removeLevelOfDataSetCode = function(datasetCode){
		if (datasetCode.match(".*\\d$")){
			return datasetCode.slice(0,-1);
		}else{
			return datasetCode;
		}
	};

	// $scope.setCurrentSection = function(section){
	// 	console.log($scope.currentSection.displayName);
	// }

	$scope.filterByDataSet = function(sc){
		var inDataSet = false;
		//console.log($scope.sections.length);	
		angular.forEach($scope.dataset.sections, function(dsSection){
			if (sc.id === dsSection.id) {
				inDataSet = true;
			}
		});
		return inDataSet;
		//return dataElement.id && .indexOf(dataElement.id) !== -1;		
	}

	$scope.getIndicatorGrp = function(){
		$scope.indicatorGrp = IndicatorGrp.get({indicatorGrpId:$scope.selectedGrp.id}); 
		$("#IndicatorGrpContainer").show(); 
	}

	$scope.getNuminator = function(indicator){
		var re = /(NUM:)(.*)(DENOM:)/;
		var result = re.exec(indicator.displayDescription);
		if (result!== null){
			return result.length > 1 ? result[2] : "x";
		}
	}

	$scope.getDenominator = function(indicator){
		var re = /(DENOM:)(.*)/;
		var result = re.exec(indicator.displayDescription);
		if (result!== null){
			return result.length > 1 ? result[2] : "x";
		}
	}

	$scope.getDescription = function(indicator){
		var re = /(.*)(NUM:)/;
		var result = re.exec(indicator.displayDescription);
		if (result!== null){
			return result[1];
		}
		else{
			return indicator.displayDescription;
		}
	}

}]);

HmisReport.controller('SectionController', ['$scope', 'Elements',function($scope,Elements){
    $scope.getElementsInSection = function(section){
		var elementIds;

		$scope.dataElements = {};

		angular.forEach(section.dataElements, function(element,key){
			if (key!=0){			
				elementIds = elementIds + "," + element.id;
			}else{
				elementIds = element.id;
			}
		});

		$scope.dataElements = Elements.get({IdList:"[" + elementIds + "]"});
		
	}

	
}]);

HmisReport.config(function ($translateProvider) {
	  
	  $translateProvider.useStaticFilesLoader({
        prefix: 'languages/',
        suffix: '.json'
    });
	  
	  $translateProvider.registerAvailableLanguageKeys(
			    ['es', 'fr', 'en', 'pt'],
			    {
			        'en*': 'en',
			        'es*': 'es',
					'fr*': 'fr',
					'pt*': 'pt',
			        '*': 'en' // must be last!
			    }
			);
	  
	  $translateProvider.fallbackLanguage(['en']);

	  jQuery.ajax({ url: dhisUrl + 'userSettings/keyUiLocale/', contentType: 'text/plain', method: 'GET', dataType: 'text', async: false}).success(function (uiLocale) {
		  if (uiLocale == ''){
			  $translateProvider.determinePreferredLanguage();
		  }
		  else{
			  $translateProvider.use(uiLocale);
		  }
    }).fail(function () {
  	  $translateProvider.determinePreferredLanguage();
	  });
	  
});


//TO DO:
// 
//Utilize dossiers from new OU strucutre 
//Include into translate function global location field to be used for retrieving right dossier text
//Utilize data service attribute, set only on the datasets ones we want to see (largest ammount of elements)
//service code pased on dataset code without level and period
//add edit authorization
//Enable editor for use 
