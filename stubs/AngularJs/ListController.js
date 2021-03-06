(function ()
{
	/*
	 *		- Scaffolder code generate - 
	 *			por Codificar Sistemas Tecnologicos
	 *
	 *		{{class_name}} Controller List 
	 *		Angular Controller to List view 
	 *
	 */

	'use strict';

	angular
		.module('app.{{table_name}}.list', ['ui.grid', 'ui.grid.pagination', 'ui.grid.autoResize', 'ui.grid.exporter',, 'angular-loading-bar', 'app.components.resize-uigrid', 'app.components.datepicker-range'])
		.controller('{{class_name}}ListController', {{class_name}}ListController);


	/** @ngInject */
	function {{class_name}}ListController(datasource, apiResolver, api, $mdSidenav, $mdDialog, $mdToast, $scope, $translate, $filter, uiGridConstants, uiGridExporterConstants, i18nService, $state)
	{

		i18nService.setCurrentLang(getLang());
		var vm = this;
		
		// Objects
		vm.$t 			= $filter('translate');
		vm.api 			= api;
		vm.isFiltered 	= false;
		vm.actionIcons 	= [
			{ label: vm.$t('common_words.edit'), color: 'md-blue-500-bg', icon: 'icon-pencil', action: "vm.editItem(row.entity.id)" },
			{ label: vm.$t('common_words.show_details'), color: 'md-blue-grey-500-bg', icon: 'icon-magnify', action: "vm.showItem(row, $event)" },
			{ label: vm.$t('common_words.remove'), color: 'md-red-500-bg', icon: 'icon-close', action: "vm.removeItemCtrl(row.entity.id, $event)" },
		];
		vm.itemsSelected = [];
		vm.arrayItemsSelected = [];
		vm.actionIconsHtml 			= createIconsHtml(vm.actionIcons);
		vm.selectsHeaderIconsHtml 	= createSelects('header', "vm.selectAll(row, $event)", 0);
		vm.selectsIconsHtml 		= createSelects('cell', "vm.selectItemCtrl(row.entity.id, $event)", "vm.returnId(row.entity.id)");
		vm.columns =  [
			{ name: 'selecionar todos', headerCellTemplate: vm.selectsHeaderIconsHtml, cellTemplate: vm.selectsIconsHtml, width: 70, enableSorting: false},
			{{grid_columns}},
			{ name: vm.$t('list.actions'), cellTemplate: vm.actionIconsHtml, width: 120 } ,
		];
		vm.expand 		= false;
		vm.searchParams = {
			sort: [],
			pagination: {
				actual: 1,
				itensPerPage: 25,
			},
			filters: {}
		};

		// Methods (A-Z)
		vm.createIconsHtml 		= createIconsHtml;
		vm.createRowData 		= createRowData;
		vm.createSelects 		= createSelects;
		vm.editItem 			= editItem;
		vm.existItems 			= existItems;
		vm.exportItem 			= exportItem;
		vm.getColumns 			= getColumns;
		vm.getEnterClick 		= getEnterClick;
		vm.getFilter 			= getFilter;
		vm.getLang 				= getLang;
		vm.getPagination 		= getPagination;
		vm.openConfirmDialog	= openConfirmDialog;
		vm.openCustomDialog 	= openCustomDialog;
		vm.removeFilter 		= removeFilter;
		vm.removeItem 			= removeItem;
		vm.removeItemCtrl 		= removeItemCtrl;
		vm.showItem 			= showItem;
		vm.selectAll 			= selectAll;
		vm.selectItemCtrl 		= selectItemCtrl;
		vm.sendToast 			= sendToast;
		vm.setDataSource 		= setDataSource;
		vm.setGridUiOpts 		= setGridUiOpts;
		vm.simpleFilter 		= simpleFilter;
		vm.toggleColumns 		= toggleColumns;
		vm.toggleSidenav 		= toggleSidenav;
		vm.removeItems 			= removeItems;
		vm.returnId 			= returnId;

		// setGridUiOpts
		setGridUiOpts(datasource);
		vm.existItems(datasource);

		// show or hide box "No items found"
		function existItems(dataItems){
			if(dataItems.data.length > 0){
				vm.noItems = false;
			}else{
				vm.noItems = true;
				vm.showActions = false;
			}
		}

		/* --------- GET ---------*/
		
		// Set filters on searchParams and gets datasource
		function getFilter() {

			// Just do stuff if there is any kinding of filtering
			if(Object.keys(vm.searchParams.filters).length >= 1) {
				vm.isFiltered = true;
				setDataSource();				
			}
		}

		// Get columns (and it's properties) with params
		function getColumns(columns, itens, all) {
			if(itens === undefined) { itens = ['name','field','order','priority','visible']; }
			if(all === undefined) { all = true; }

			var sort = []; var i = 0;
			columns.forEach(function(column) {
				// Just add to the object if there is any kinding of sorting
				if(all || column.sort !== undefined && column.sort.direction !== undefined) {
					sort[i] = {};
					itens.forEach(function(item) {
						switch(item) {
							case "name":
							sort[i].name = column.displayName;  break;
							case "field":
							sort[i].field = column.field; break;
							case "order":
							sort[i].order = column.sort.direction; break;
							case "priority":
							sort[i].priority = column.sort.priority; break;
							case "visible":
							sort[i].visible = column.visible; break;
						}
					});
					i++;
				}
			});
			return sort;
		}

		// Get pagination on gridApi
		function getPagination(newPage, pageSize) {
			var pagination = {
				actual: newPage,
				itensPerPage: pageSize,
			};
			return pagination;
		}

		// Get the current language, and set it's correctly
		function getLang() {
			var lang = $translate.use();
			switch(lang) {
				case "pt_BR":
					return "pt-br";
				default:
					return lang;
			}
		}

		// Get enter click
		function getEnterClick(event){
			var KEY_CODE_ENTER = 13;			
			if(event.keyCode == KEY_CODE_ENTER){
				vm.simpleFilter();
			}
		}

		// Simple filter 
		function simpleFilter(){
			vm.searchParams.filters["{{table_name}}"] = {};
			angular.forEach(vm.columns, function(column){
				if(column.field != undefined)
					vm.searchParams.filters["{{table_name}}"][column.field] = vm.searchParams.filters.search;
			});
			// function filter
			vm.searchParams.simpleFilter = true;
			setDataSource();	
		}

		// Select all items
		vm.initSelectAll = false;
		function selectAll(row, $event){
			vm.initSelectAll = !vm.initSelectAll;
			var i;
			vm.showActions = vm.initSelectAll;

			angular.forEach(vm.arrayItemsSelected, function(item, key){
				vm.itemsSelected[key] = vm.initSelectAll;	
				vm.arrayItemsSelected[key] = vm.initSelectAll;
			});
		}

		// select item
		function selectItemCtrl(id, $event){
			if(vm.itemsSelected[id] == undefined)
				vm.itemsSelected[id] = false;
			vm.itemsSelected[id] = !vm.itemsSelected[id];
			if(vm.itemsSelected[id] == true){
				vm.arrayItemsSelected[id] = true;
			}else{
				vm.arrayItemsSelected[id] = false;				
			}
			vm.showActions = false;
			angular.forEach(vm.arrayItemsSelected, function(item, key){
				if(vm.arrayItemsSelected[key] == true || vm.arrayItemsSelected[key] == key) vm.showActions = true;
			});
		}
		// return ids in page
		function returnId(id){
			if(vm.arrayItemsSelected[id] == undefined)
				vm.arrayItemsSelected[id] = false;
			if(vm.itemsSelected[id] == undefined) vm.itemsSelected[id] = false;
			return vm.itemsSelected[id];
		}

		/* --------- SET ---------*/

		// Register the API
		function onRegisterApi(gridApi){
			vm.gridApi = gridApi;
			vm.gridApi.core.on.sortChanged($scope, function(vmgrid) {
				vm.searchParams.sort = getColumns(vmgrid.columns, ['field','order','priority'], false);
				setDataSource();
			});
			vm.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
				vm.searchParams.pagination = getPagination(newPage, pageSize);
				vm.gridUiOpts.pageNumber = vm.searchParams.pagination.actual;
				vm.gridUiOpts.pageSize = vm.searchParams.pagination.itensPerPage;
				vm.gridUiOpts.minRowsToShow = vm.searchParams.pagination.itensPerPage;
				setDataSource();
			});
		}

		// Define the options to the grid
		function setGridUiOpts(datasource){
			vm.gridUiOpts = {
				data: 						datasource.data,
				paginationPageSize: 		datasource.per_page,
				paginationPageSizes: 		[25, 50, 100],
				useExternalSorting: 		true,
				useExternalFiltering: 		true,
				useExternalPagination: 		true,
				enableSorting: 				true,
				totalItems: 				datasource.total,
				minRowsToShow: 				datasource.per_page, // Must be the same value of paginationPageSize
				rowHeight: 					51,
				columnDefs: 				vm.columns,
				enableHorizontalScrollbar: 	uiGridConstants.scrollbars.NEVER,
				enableVerticalScrollbar: 	uiGridConstants.scrollbars.NEVER,
				onRegisterApi: 				onRegisterApi
			};
		}


		// Get source from database and set on gridUiOpts
		function setDataSource(){
			var source = apiResolver.resolve('{{class_name_lw}}@query', vm.searchParams);
			source.then(function(data){
				vm.existItems(data);
				setGridUiOpts(data);
			});
		}


		/* --------- CREATE ---------*/

		// Create the icons of datagrid actions column
		function createIconsHtml(icons) {
			var iconsHtml = '<div class="ui-grid-cell-contents ui-grid-cell-actions ng-binding ng-scope">';
			icons.forEach(function (icon){
				iconsHtml += '<md-button aria-label="' + icon.label + '" title="' + icon.label + '" class="md-fab md-dg-icon ' + icon.color + ' md-mini" ng-click="grid.appScope.' + icon.action + '"><i class="icon ' + icon.icon + '"></i></md-button>';
			});

			iconsHtml += '</div>';
			return iconsHtml;
		}

		// create the selects 
		function createSelects(type, action, valueId){
			if(type == 'header')
				return '<div class="ui-grid-cell-contents cell-select-items ui-grid-cell-actions ng-binding ng-scope">  <md-checkbox "class="md-align-top-left" ng-click="grid.appScope.vm.selectAll()" flex> </div>';
			else{
				return '<md-button class="ui-grid-cell-contents cell-select-items ui-grid-cell-actions ng-binding ng-scope">  <md-checkbox ng-checked="grid.appScope.'+ valueId +'" ng-click="grid.appScope.'+ action +'" "class="md-align-top-left" flex> </md-button>';
			}
		}

		function createRowData(data) {

			var i = 0; var itens = {
				title: vm.$t("list.dialogs.show_item.title"),
				data: []
			};
			function addLine(column, value, key) {
				if(column && ('name' in column) && column.name && column.name != vm.$t('list.actions')) {
					itens.data.push({
						name: column.name,
						value: value
					});
				}			
			}
			for(var key in data) {
				var item = data[key];
				if(typeof item === 'object') {
					for(var k in item) { addLine(vm.gridApi.grid.columns[i], item[k], k); i++; }
					i--;
				} else { addLine(vm.gridApi.grid.columns[i], item, key); } 
				i++;
			}
			return itens;
		}

		// Create a toast with params
		function sendToast(text, parent) {
			$mdToast.show(
				$mdToast.simple()
				.textContent(text)
				.position('top right')
				.hideDelay(3000)
				.parent(parent)
			);
		}

		// Create a confirm dialog with params
		function openConfirmDialog(params) {

			// create dialog
			var dialog = $mdDialog.confirm()
				.title(params.title)
				.textContent(params.text)
				.clickOutsideToClose(true)
				.parent(angular.element(document.body))
				.ok(params.buttons.ok)
				.cancel(params.buttons.cancel);
			// show dialog
			$mdDialog.show(dialog).then(params.callback);
		}

		// Create a custom dialog with params
		function openCustomDialog(params) {
			// defaults
			var dialog = {
				targetEvent: params.event,
				clickOutsideToClose: true				
			};

			// cheking if is template or templateUrl
			if(params.template.url === true) { dialog.templateUrl = params.template.html; }
			else { dialog.template = params.template.html; }
				// cheking if there is a locals defined
			if(params.locals !== undefined) {
				dialog.locals = { dg: params.locals };
			}
				// cheking if there is a controller undefined
			if(params.controller !== undefined) { dialog.controller = params.controller; }
				// but if there is locals must hava a controller
			else if(params.locals !== undefined) { 
				dialog.controller =  function($scope, dg, $mdDialog){ 
					$scope.dg = dg;
					$scope.closeDialog = function() {
						$mdDialog.hide();
					};
					// cheking if there is a callback defined
					if(params.callback !== undefined) {
						$scope.callback = params.callback;
					}
				};
			}

			var confirm = $mdDialog.show(dialog);
		}


		/* --------- ACTIONS ---------*/

		/* --- toggle:actions --- */

		// Toggle columns visibility on Advanced Options
		function toggleColumns($event) {	

				// Appending dialog to document.body to cover sidenav in docs app
				vm.gridColumns = getColumns(vm.gridApi.grid.columns);

				var toggleController = function($scope, dg, $mdDialog){ 
					$scope.dg = dg;
					$scope.closeDialog = function() {
						$mdDialog.hide();
					};
					$scope.toggleColumn = function(column, i) {
						if(column.visible) {
							column.visible = false; vm.columns[i].visible = false;
						} else { 
							column.visible = true; vm.columns[i].visible = true;
						}
					};
					$scope.hideColumns = function() {
						$mdDialog.hide();
						vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
					};
				};

				var params =  {
					event: $event,
					template: {
						url: true,
						html: '/app/main/components/dialog/choose_columns.dialog.html'
					},
					locals: {
						title: vm.$t("advanced_options.choose_columns.title"),
						data: vm.gridColumns,
						explain: vm.$t("advanced_options.choose_columns.explain")
					},
					controller: toggleController
				};

				openCustomDialog(params);
		}

		// Toggle sidenav
		function toggleSidenav(sidenavId) {
			$mdSidenav(sidenavId).toggle();
		}

		/* --- remove:actions --- */

		// Remove filters and gets datasource
		function removeFilter() {
			vm.searchParams.filters = {};
			vm.isFiltered = false;
			setDataSource();
		}

		function removeItem(params) {
			var item = apiResolver.resolve('{{class_name_lw}}@delete', {id: params.id});
			return item.then(function(data){
				setDataSource();
				vm.sendToast(vm.$t("list.toasts.remove_item.success", { entity: ""+vm.$t("{{table_name}}.singular")+""}), params.parent);
			}, function(data){
				vm.sendToast(vm.$t("list.toasts.remove_item.error", { entity: ""+vm.$t("{{table_name}}.singular")+""}), params.parent);
			});
		}

		function removeItemCtrl(id, $event) {

			// Defining variables
			// md-button
			var el = angular.element($event.currentTarget);
				// el <- ui-grid-cell-contents <- .ui-grid-cell <- .ng-isolate-scope <- .ui-grid-row
			var parent = el.parent().parent().parent().parent();
			var item = { id: id, parent: parent };
			var dialog = {
				title: vm.$t("list.dialogs.remove_item.title", { entity: ""+vm.$t("{{table_name}}.singular")+""}) ,
				text: vm.$t("list.dialogs.remove_item.content", { entity: ""+vm.$t("{{table_name}}.singular")+""}),
				buttons: { ok: vm.$t("common_words.yes"), cancel: vm.$t("common_words.no") },
				callback: function (){ vm.removeItem(item); }
			};
			vm.openConfirmDialog(dialog);
		}

		function removeItems(){
			var its = [], str = "";
			angular.forEach(vm.arrayItemsSelected, function(item, key){
				if(vm.arrayItemsSelected[key] == true || vm.arrayItemsSelected[key] == key){
					str += key + ",";
					its.push(key);
				}
			});
			var params = { parent: "", id: str};
			// vm.removeItem(item);
			var item = apiResolver.resolve('{{class_name_lw}}@delete', {id: params.id});
			return item.then(function(data){
				setDataSource();
			}, function(error){
				console.log('error: ');
				console.log(error);
			});
		}

		/* --- edit:actions --- */

		function editItem(id) { 
			$state.go('app.{{table_name}}_register', {id: id});
		}

		/* --- others:actions --- */
		function showItem(row, $event) { 
			var params =  {
				event: $event,
				template: {
					url: true,
					html: '/app/main/components/dialog/list_item_details.dialog.html'
				},
				locals: createRowData(row.entity)
			};
			openCustomDialog(params);
		}
		
		function exportItem(type) {
			if (type == 'csv') {
				vm.gridApi.exporter.csvExport( uiGridExporterConstants.ALL, uiGridExporterConstants.ALL );
			} else if (type == 'pdf') {
				vm.gridApi.exporter.pdfExport( uiGridExporterConstants.ALL, uiGridExporterConstants.ALL );
			}
		}
	}
})();
