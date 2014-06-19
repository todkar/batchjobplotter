google.setOnLoadCallback(grabDataAndDrawChart);

function grabDataAndDrawChart() {
  var url = "http://graphite.px.gid.gap.com/render?from=-2hours&until=now&width=400&height=250&target=rrd-longterm.pxlicapp101.gid-icmTcSrv-TimerMonitor_*.counter-TotalDuration.value&_uniq=0.6581096386090421&title=rrd-longterm.pxlicapp101.gid-icmTcSrv-TimerMonitor_AdjustInventoryTimer.counter-TotalDuration.value&format=json&jsonp=?";
  $.getJSON(url, function(data) {
      return drawChart(convert(data));
  });
}

function drawChart(chartData) {
  var container = document.getElementById('container');
  var chart = new google.visualization.Timeline(container);
  var dataTable = new google.visualization.DataTable();

  dataTable.addColumn({ type: 'string', id: 'Batch Job' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });

  dataTable.addRows(chartData);

  chart.draw(dataTable);
}

function mockData() {
  return [
    {"target": "CartonCleanupFilterAPITimer.counter-TotalDuration.value",
        "datapoints": [[3*60*60*1000, 1403160060], [2.7*60*60*1000, 1403119302]]},
     {"target":
         "TimerMonitor_GIDPrintSVCShipmentsInvokeTimer.counter-TotalDuration.value",
         "datapoints": [[4.5*60*60*1000, 1403160060]]},
     {"target":
         "TimerMonitor_YFSEventManagerRaiseEventTimer.counter-TotalDuration.value",
         "datapoints": [[3.9*60*60*1000, 1403160060]]}
  ];

}

function convert(data) {
  var chartData = [];
  jQuery.each(data, function(index, metric) {
    var metric_name = metric.target;
    var datapoints = metric.datapoints;
    $.each(datapoints, function(index, element){
      var execution_time = element[0];
      if(execution_time != null && execution_time > 0) {
        var m = moment.unix(element[1]);
        var end_time = m.clone();
        var start_time = m.subtract('ms', execution_time);
        chartData.push([metric_name, start_time.toDate(), end_time.toDate()]);
      }
    });

  });
  return chartData;
}
