/*
 * File: app/view/TrainLines.js
 *
 * This file was generated by Sencha Architect
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.4.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.4.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('TrainTrax.view.TrainLines', {
	extend: 'Ext.Panel',
	alias: 'widget.lines',

	requires: [
		'Ext.Toolbar',
		'Ext.dataview.List',
		'Ext.XTemplate'
	],

	config: {
		layout: 'vbox',
		items: [
			{
				xtype: 'toolbar',
				docked: 'top',
				title: 'Train Trax'
			},
			{
				xtype: 'container',
				flex: 0.5,
				html: '<iframe frameborder="0" style="border:0; width:100%; height:100%" src="https://www.google.com/maps/embed/v1/place?q=42.2324753%2C-88.3441376&key=AIzaSyDV7JR5io6wpfo5UN56Ny_uEFqX71HMFGM" allowfullscreen></iframe> '
			},
			{
				xtype: 'list',
				flex: 1,
				itemId: 'trainLineList',
				itemCls: 'tt_lineListItem',
				itemTpl: [
					'<div class="tt_lineListItemInner" style="color:#{RouteTextColor}; background-color:#{RouteColorCode};">{Route} <tpl if=\'RouteStatus != "Normal Service"\'><i class="fa fa-exclamation-triangle" style="float:right;"></i></tpl></div>'
				],
				store: 'TrainLineStore'
			}
		],
		listeners: [
			{
				fn: 'onTrainLineListSelect',
				event: 'select',
				delegate: '#trainLineList'
			}
		]
	},

	onTrainLineListSelect: function(dataview, record, eOpts) {
		AERP.Ajax.request({
		    url:'getStationsOfLine',
		    params:{lineId:record.get('ServiceId')},
		    success:function(reply){
		        Ext.ComponentQuery.query('#trainLineStopsList')[0].getStore().setData(reply.data);
		        Ext.ComponentQuery.query('#cardsScreen')[0].setScreen('trainLineStopsScreen');
		        Ext.ComponentQuery.query('#stopsTitlebar')[0].setStyle('background:#'+record.get('RouteColorCode')+';');
		        var bar = Ext.ComponentQuery.query('#stopsTitlebar')[0].setTitle('<span style="text-shadow:none; color:#'+record.get('RouteTextColor')+';">'+record.get('NiceName')+'</span>');

		        if(record.get('RouteStatus') == "Normal Service"){
		            Ext.ComponentQuery.query('#trainLineStatusBar')[0].hide();
		        }else{
		            Ext.ComponentQuery.query('#trainLineStatusBar')[0].show();

		        }
		        Ext.ComponentQuery.query('#trainLineStatusLabel')[0].setHtml('<div class="marquee">'+record.get('RouteStatus')+'</div>');
		        Ext.ComponentQuery.query('#trainLineStatusBar')[0].setStyle('background:#'+record.get('RouteStatusColor')+';');
		    }
		});



	}

});