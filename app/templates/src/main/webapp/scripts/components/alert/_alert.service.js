'use strict';

angular.module('<%=angularAppName%>')
    .factory('AlertService', function ($timeout, $sce<% if (enableTranslation) { %>,$translate<% } %>) {
        var alertId = 0, // unique id for each alert. Starts from 0.
        alerts = [],
        timeout = 5000; // default timeout

        function clear() {
            alerts = [];
        }

        function get() {
            return alerts;
        }

        function success(msg, params) {
            addAlert({
                type: 'success',
                msg: msg,
                params: params,
                timeout: timeout
            });
        }

        function error(msg, params) {
            addAlert({
                type: 'danger',
                msg: msg,
                params: params,
                timeout: timeout
            });
        }

        function warning(msg, params) {
            addAlert({
                type: 'warning',
                msg: msg,
                params: params,
                timeout: timeout
            });
        }

        function info(msg, params) {
            addAlert({
                type: 'info',
                msg: msg,
                params: params,
                timeout: timeout
            });
        }

        function factory(alertOptions) {
            return alerts.push({
                type: alertOptions.type,
                msg: $sce.trustAsHtml(alertOptions.msg),
                id: alertOptions.alertId,
                timeout: alertOptions.timeout,
                close: function () {
                    return closeAlert(this.id);
                }
            });
        }

        function addAlert(alertOptions) {
            alertOptions.alertId = alertId++;
            alertOptions.msg = $translate.instant(alertOptions.msg, alertOptions.params);
            factory(alertOptions);
            if (alertOptions.timeout && alertOptions.timeout > 0) {
                $timeout(function () {
                    closeAlert(alertOptions.alertId);
                }, alertOptions.timeout);
            }
        }

        function closeAlert(id) {
            return closeAlertByIndex(alerts.map(function(e) { return e.id; }).indexOf(id));
        }

        function closeAlertByIndex(index) {
            return alerts.splice(index, 1);
        }

        return {
            factory: factory,
            add: addAlert,
            closeAlert: closeAlert,
            closeAlertByIndex: closeAlertByIndex,
            clear: clear,
            get: get,
            success: success,
            error: error,
            info: info,
            warning : warning
        };
    });
