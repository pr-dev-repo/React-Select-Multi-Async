//     ____  _________   ____________   _____ ________    __________________   ___   _______  ___   ________
//    / __ \/ ____/   | / ____/_  __/  / ___// ____/ /   / ____/ ____/_  __/  /   | / ___/\ \/ / | / / ____/
//   / /_/ / __/ / /| |/ /     / /     \__ \/ __/ / /   / __/ / /     / /    / /| | \__ \  \  /  |/ / /     
//  /  _,_/ /___/ ___ / /___  / /     _ _/ / /___/ /___/ /___/ /___  / /    / ___ |___/ /  / / /|  / /___   
// /_/ |_/_____/_/  |_\____/ /_/     /____/_____/_____/_____/\____/ /_/    /_/  |_/____/  /_/_/ |_/\____/   

//Copyright (c) 2017 Jed Watson.
//Contributor 2017 Gabriel Rodriguez.
//Contributor 2017 Orlando Morales.
//Licensed under the MIT License (MIT), see
//http://jedwatson.github.io/react-select



$(document).ready(function () {

    var collection = $('.select-async'); debugger;
    collection.each(function () { //iterate on react-selects

        var selectId = '#' + this.id;
        addSelect(selectId);
    });
});
//load and render react-select
function addSelect(id) {
    debugger;
    var json = $(id).data('selectx-json');
    var DATA = getOptionsData(json);

    var disabled = $(id).data('selectx-disable');
    var multi = $(id).data('selectx-multi');
    var defaultVal = $(id).data('selectx-default');
    var isDisabled = (disabled ? disabled : false);
    var isMulti = (multi ? multi : false);
    var label = $(id).data('selectx-label');
    var value = $(id).data('selectx-value');
    var selectPlaceholder = $(id).data('selectx-localizer');

    var hasDefault = $(id).data('selectx-default');
    var labelDefault;

    if (hasDefault) {
        labelDefault = DATA[0].bankName;
        $('#BankID').val(DATA[0].fIID);
    } else {
        labelDefault = selectPlaceholder;
    }

    var options = DATA;
    var MAX_RESULTS = 20; //check
    var ASYNC_DELAY = 500;

    if (!DATA) { //validate
        DATA = [{ label: "", value: "" }, { label: "", value: "" }];
        label = "";

    }


    var Container = React.createClass({
        getInitialState: function () {
            return {
                multi: isMulti,
                options: DATA,
            };
        },

        getFilteredResults: function getFilteredResults(input, callback) {
            input = input.toLowerCase();
        
            var options = DATA.filter(function (i) {
                var tempVal;

                switch (label) {
                    case 'bankName':
                        tempVal = i.bankName;
                        break;

                    case 'merchantData':
                        tempVal = i.merchantData;
                        break;

                    case 'email':
                        tempVal = i.email;
                        break;

                    case 'roleDesc':
                        tempVal = i.roleDesc;
                        break;

                    case 'name':
                        tempVal = i.name;
                        break;
                    case 'channel':
                        tempVal = i.channel;
                        break;

                    case 'merchantUser':
                        tempVal = i.merchantUser;
                        break;
                    case 'terminal':
                        tempVal = i.terminal;
                        break;

                    default:
                        tempVal = i.label;

                }

                tempVal = (tempVal === null ? '' : tempVal);
                return tempVal.toLowerCase().substr(0, input.length).indexOf(tempVal);

            });
            var data = {
                options: options.slice(0, MAX_RESULTS),
                complete: options.length <= MAX_RESULTS

            };
            setTimeout(function () {
                callback(null, data);

            }, ASYNC_DELAY);

        },
        updateValue: function (value) {
            debugger;
            updateHiddenValues(id, value); //valueForAspFor&callajax


            this.setState({ value: value });

        },
        render: function () {

            return React.createElement(Select.Async, {
                multi: isMulti,
                simpleValue: true,
                labelKey: label,
                valueKey: value,
                clearable: true,
                disabled: isDisabled,
                searchable: true,
                value: this.state.value,
                loadOptions: this.getFilteredResults,
                simpleValue: true,
                placeholder: hasDefault ? labelDefault : selectPlaceholder + '...',
                autoload: true, // show on 1 click
                onChange: this.updateValue,
                searchPromptText: locolizedTypeToSearch

            });
        }
    });

    React.render(
        React.createElement(Container),
        document.getElementById(id.replace('#', ''))

    );


}

function updateHiddenValues(inputId, value) {


    switch (inputId) {
        case '#select-banks':
            $('#BankID').val(value);

            checkEnableOrder(inputId);
            addSelect('#select-merchants');

            break;
        case '#select-bank-list':
            $('#BankList').val(value);

            checkEnableOrderMetrics(inputId);
            addSelect('#select-channels');
            break;
        case '#select-merchants':
            $('#MerchantID').val(value); debugger;
            checkEnableOrder(inputId);
            addSelect('#select-user');

            break;
        case '#select-merchants-list':
            $('#MerchantList').val(value); debugger;
            break;
        case '#select-channels':
            $('#ChannelList').val(value); debugger;

            checkEnableOrderMetrics(inputId);
            addSelect('#select-merchants-list');
            break;
        case '#select-user':
            $('#UserID').val(value);
            break;
        case '#select-role':
            $('#RoleID').val(value);
            break;
        case '#select-action':
            $('#ActionID').val(value);
            break;

            //pos
        case '#select-bank-list-pos':
            $('#BankList').val(value);

            checkEnableOrderMetrics(inputId);
            addSelect('#select-merchant-list-pos');
            break;
        case '#select-merchant-list-pos':
            $('#MerchantList').val(value);

            checkEnableOrderMetrics(inputId);
            addSelect('#select-terminal-list-pos');
            break;
        case '#select-terminal-list-pos':
            $('#ChannelList').val(value);
            break;
        default:
            //do
    }
}

function checkEnableOrder(id) {
    var order = $(id).data('selectx-order');

    if (order === 1) {
        var bankId = $('#BankID').val();
        tempId = $('div[data-selectx-order=2]').attr('id');
        getJsonData('#' + tempId, urlMerchantByBankId, "bankId=", bankId);

    } else if (order === 2) {
        var merchantId = $('#MerchantID').val();
        tempId = $('div[data-selectx-order=3]').attr('id');
        getJsonData('#' + tempId, urlUsersByMerchantId, "MerchantId=", merchantId);
        //pos
    }

    return tempId;

}

function checkEnableOrderMetrics(id) {
    var order = $(id).data('selectx-order');
    debugger;
    if (order === 1) {
        var bankId = $('#BankList').val();
        tempId = $('div[data-selectx-order=2]').attr('id');
        getJsonData('#' + tempId, urlChannelbyBank, "bankId=", bankId);

    } else if (order === 2) {
        debugger;
        tempId = $('div[data-selectx-order=3]').attr('id');
        getJsonDataMultParams('#' + tempId, urlMerchantsbyChannels);
        //POS MODE BELOW
    } else if (order === 4) {
        var bankId = $('#BankList').val();
        tempId = $('div[data-selectx-order=5]').attr('id');
        getJsonData('#' + tempId, urlPosMerchantsByBank, "bankId=", bankId);

    } else if (order === 5) {
        var merchantIds = $('#MerchantList').val();
        tempId = $('div[data-selectx-order=6]').attr('id');
        getJsonData('#' + tempId, urlPosTerminalsByMerchant, "MerchantList=", merchantIds);

    }

    return tempId;

}

function getJsonData(id, url, paramName, paramVal, pos ) {

    if (!paramVal) {
        $('#select-user').data('selectx-disable', true);
        $('#select-merchant-list-pos').data('selectx-disable', true); //check
        return;

    }

    $.ajax({
        type: "POST",
        url: url,
        data: paramName + paramVal,
        async: false,
        success: function (data) {
            debugger
            if (data !== null) {
                // Enabled Merchant Dropdown List
                $(id).data('selectx-disable', false);
                // Convert data received in json and insert into data-selectx-json attribute
                var json = JSON.stringify(data);
                $(id).data('selectx-json', json);

            }
        }
    });

}

function getJsonDataMultParams(id, url, name, value) {
    var bankId = $('#BankList').val();
    var channels = $('#ChannelList').val();
    debugger;
    if (!channels || !bankId) {

        $('#select-merchants-list').data('selectx-disable', true);
        return;

    }

    $.ajax({
        type: "POST",
        url: url,
        data: { bankID: bankId, channelList: channels },
        async: false,
        success: function (data) {
            debugger
            if (data !== null) {
                // Enabled Merchant Dropdown List
                $(id).data('selectx-disable', false);
                // Convert data received in json and insert into data-selectx-json attribute
                var json = JSON.stringify(data);
                $(id).data('selectx-json', json);

            }
        }
    });

}


function getOptionsData(options) {
    var data;

    if (typeof options === 'string' && options !== '') {
        data = JSON.parse(options);

    } else {
        data = options;

    }

    return data;

}
