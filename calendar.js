(function (root) {

    var __DEFAULT__ = {
        plugName : 'Calendar',
        auther: 'fireFly',
        version: '0.0.1',
        node: document.body,
        willdays: 30
    };

    var obj = {
        node: {},
        nodeT: {},
        unable: [],
        handle: [],
        status: []
    };

    var F = {
        //计算某年某月有多少天
        getDaysInMonth: function(year, month) {
            return new Date(year, month + 1, 0).getDate();
        },
        //计算某月1号是星期几
        getWeekInMonth: function(year, month) {
            return new Date(year, month, 1).getDay();
        },
        getMonth: function(m) {
            return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][m];
        },
        //计算年某月的最后一天日期
        getLastDayInMonth: function(year, month) {
            return new Date(year, month, this.getDaysInMonth(year, month));
        }
    };

    var PlugCode = function (options) {

        var newDate = new Date();
        this.year = newDate.getFullYear();    //今天是哪年
        this.month = newDate.getMonth() + 1;  //今天是哪月
        this.day = newDate.getDate();         //今天是哪日
        this.week = newDate.getDay();          //今天是星期几  0-6 周日-周六
        this.acount = F.getDaysInMonth(this.year, this.month);  //这个月有多少天

        this.willDay = this.acount - this.day;   //这个月剩余多少天

        for(var prop in options) {
            __DEFAULT__[prop] = options[prop];
        }

        this.options = __DEFAULT__;

        this.options.unable && this.options.unable.map( function(item) {
            obj.status.push({month: item.split('-')[0], day: item.split('-')[1]});
        });

    };

    PlugCode.prototype = {
        init: function() {

            this.initTimePicker();

        },
        renderTitle: function (num) {
            obj.month = parseInt(this.month, 10) + num;
            if(obj.month < 10) {
                obj.month = ' 0' + obj.month;
            };
            if (obj.month == 13) {
                obj.month = 1;
                this.year += 1;
            }
            console.log(obj.month);
            var p = document.createElement('p');
            p.className = 'year';
            p.innerHTML = this.year + ' 年 ' + obj.month + '月';
            obj.node.appendChild(p);
        },
        renderContainer: function(num) {   //num = 0 渲染当月  num = 1 渲染下个月

            var that = this;
            if (!num) {
                var ul = document.createElement('ul');
                ul.className = 'month month-'+ (this.month - 0);
                if (!!this.week) {
                    for (var i = 0; i < this.week; i+=1) {
                        ul.appendChild(document.createElement('li'));
                    };
                };

                this.options.unable && this.options.unable.map( function(item) {
                    if (item.split('-')[0] == (that.month - 0 )) {
                        obj.unable.push({month: item.split('-')[0], day: item.split('-')[1]});
                    }

                });


                for (var i = 0; i < this.willDay; i +=1) {
                    var li = document.createElement('li');
                    var target = parseInt(this.day, 10) + i;

                    li.innerHTML = parseInt(this.day, 10) + i;
                    obj.unable.map( function(item) {

                       if ((obj.month - 0) == item.month && target == item.day) {
                           var tagI = document.createElement('i');
                           tagI.innerHTML = '暂不可约';
                           li.appendChild(tagI);
                       }
                    });

                    this.addClick(li);

                    ul.appendChild(li);
                };
                obj.node.appendChild(ul);
            } else {
                var ul = document.createElement('ul');
                ul.className = 'month month-'+ (this.month - 0);
                ul.style.paddingBottom = '1.5rem';
                var residue = this.options.willdays - parseInt(this.willDay, 10);   //剩余天数
                var week = F.getWeekInMonth(this.year, parseInt(this.month, 10) - 1);

                if (!!week) {
                    for (var i = 0; i < week; i+=1) {
                        ul.appendChild(document.createElement('li'));
                    };
                };


                this.options.unable && this.options.unable.map( function(item) {
                    if (item.split('-')[0] == (that.month - 0 + 1 )) {

                        obj.unable.push({month: item.split('-')[0], day: item.split('-')[1]});
                    }

                });


                for (var i = 0; i < residue; i +=1) {
                    var li = document.createElement('li');
                    var target = i + 1;
                    li.innerHTML = i+1;
                    obj.unable.map( function(item) {

                        if ((obj.month - 0) == item.month && target == item.day) {
                            var tagI = document.createElement('i');
                            tagI.innerHTML = '暂不可约';
                            li.appendChild(tagI);
                        }
                    });
                    this.addClick(li);

                    ul.appendChild(li);
                };
               obj.node.appendChild(ul);
            }

        },
        initDatePicker: function() {
            var _this = this;
            var div = document.createElement('div');

            div.className = 'box color';
            obj.node = div;
            this.options.node.appendChild(div);
            var p = document.createElement('p');
            var span = document.createElement('span');
            var i = document.createElement('i');
            i.addEventListener('touchstart', function () {
                var parentNode = this.parentNode.parentNode.parentNode;
                while (parentNode.childNodes[0]){
                    parentNode.removeChild(parentNode.childNodes[0]);
                }
                _this.initTimePicker();
            });

            p.className = 'title';
            p.innerHTML = '选择服务时间';
            p.appendChild(span);
            p.appendChild(i);
            div.appendChild(p);
            var ul = document.createElement('ul');
            ul.className = 'week';
            ul.innerHTML = '<li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>';
            div.appendChild(ul);

            this.renderTitle(0);
            this.renderContainer(0);
            this.renderTitle(1);
            this.renderContainer(1);
        },
        addClick: function (ele) {

            var _this = this;
            ele.addEventListener('click', function () {

                if (!ele.classList.contains('theme-bg')) {
                    var lis = ele.parentNode.parentNode.getElementsByTagName('li');
                    for(var i = 0, length = lis.length ; i < length; i += 1){
                        lis[i].className = '';
                    }

                    this.classList.add('theme-bg');
                };


                var regExp = /(\d+)/;
                var month = this.parentNode.className.split('-')[1];
                var month_1 = (month - 0 + 1) < 10 ? '0'+(month - 0 + 1) : (month - 0 + 1);
                regExp.exec(this.innerHTML);
                var result = RegExp.$1 - 0;

                if (_this.acount - result >= 3) {
                    obj.handle = [];
                    for (var i = 0; i < 3; i += 1) {

                        obj.handle.push({month: month, day: RegExp.$1 - 0 + i});
                    }
                } else if (_this.acount - result == 2) {
                    obj.handle = [];
                    obj.handle.push({month: month, day: result});
                    obj.handle.push({month: month, day: result  + 1});
                    obj.handle.push({month: month_1, day: 1});

                } else if (_this.acount -result == 1) {
                    obj.handle = [];
                    obj.handle.push({month: month, day: result});
                    obj.handle.push({month: month_1, day: 1});
                    obj.handle.push({month: month_1, day: 2});
                }

            })
        },
        initTimePicker: function () {

            var div = document.createElement('div');
            div.classList.add('time-box');
            div.classList.add('color');
            obj.nodeT = div;

            var p = document.createElement('p');
            p.classList.add('title');
            p.innerHTML = '选择服务时间';
            var img = document.createElement('img');
            img.src = 'http://cdn.xsmore.com/Images/dyj/indet-list-delete.png';
            img.addEventListener('click', function() {
                var parent = this.parentNode.parentNode.parentNode;
                while (parent.childNodes[0]) {
                    parent.removeChild(parent.childNodes[0]);
                }
            });
            p.appendChild(img);
            div.appendChild(p);
            this.renderTimeTitile();
            this.options.node.appendChild(div);
            this.renderTimeButton(this.options.callback);

        },
        renderTimeTitile: function () {
            var ul = document.createElement('ul');
            var _this = this;
            ul.classList.add('days');

            if(!obj.handle.length) {
                for (var i = 0; i < 3; i += 1) {
                    obj.handle.push({month: this.month-0, day: this.day - 0 + i});
                }
            }


            obj.handle.map(function (item, index){
                var li = document.createElement('li');
                var p = document.createElement('p');
                var result = item.day - _this.day;
                li.innerHTML =((result == 0 ? ' 今天 ' : '') || ( result == 1 ? '  明天' : '') || (result == 2 ? ' 后天 ' : '')) + item.month + ' / ' + item.day;
                var x = '可预约';

                obj.status.map(function (e) {
                    if ( e.month - 0 == item.month - 0 && e.day - 0 == item.day - 0) {
                        x = '暂不预约';
                    }
                });
                p.innerHTML = x;
                li.addEventListener('click', function(e) {
                    var that = this;
                    var lis = ul.getElementsByTagName('li');
                    for (var j = 0; j < lis.length; j += 1) {
                        lis[j].className = '';
                    };
                    setTimeout(function () {
                        that.classList.add('theme-border');
                        that.classList.add('theme-color');
                    },0)
                });
                li.appendChild(p);
                ul.appendChild(li);
            });

            var lastLi = document.createElement('li');
            lastLi.addEventListener('click', function () {
                var parentNode = this.parentNode.parentNode.parentNode;
                while (parentNode.childNodes[0]) {
                    parentNode.removeChild(parentNode.childNodes[0]);
                }
                _this.initDatePicker();
            });
            lastLi.innerHTML = '<img src="http://cdn.xsmore.com/Images/dyj/indet-list-thirty-days.png"/><p style="color: #333">30天</p>';
            ul.appendChild(lastLi);
            obj.nodeT.appendChild(ul);

            this.renderTimeData();

        },
        renderTimeData: function () {
            var s1,e1,s2,e2,
                div = document.createElement('div'),
                ul = document.createElement('ul'),
                start = this.options.timeLine.start,
                end = this.options.timeLine.end;
            s1 = start.split(':')[0] - 0;
            s2 = start.split(':')[1] - 0;
            e1 = end.split(':')[0] - 0;
            e2 = end.split(':')[1] - 0;

            while (s1 < e1) {
                var li = document.createElement('li');
                var h, m;
                li.classList.add('theme-color');
                li.classList.add('theme-border');
                if (s1 < 10) {
                    h = '0' + s1;
                } else {
                    h = s1
                };
                if (s2 < 10) {
                    m = '0' + s2;
                } else {
                  m = s2;
                };
                li.innerHTML = h + ':' +m;
                this.addTimeClick(li, ul);
                ul.appendChild(li);
                if (s2 == 0) {
                    s2 = 30;
                } else if (s2 == 30) {
                    s2 = 0;
                    s1 += 1;
                }
            };

            if ( s1 == e1) {
                var li = document.createElement('li');
                var h, m;
                li.classList.add('theme-color');
                li.classList.add('theme-border');
                if (s1 < 10) {
                    h = '0' + s1;
                } else {
                    h = s1
                };
                if (s2 < 10) {
                    m = '0' + s2;
                } else {
                    m = s2;
                };
                li.innerHTML = h + ':' +m;
                this.addTimeClick(li, ul);
                ul.appendChild(li);
                s2 = 30;
            };

            if (s2 == e2) {
                var li = document.createElement('li');
                var h, m;
                li.classList.add('theme-color');
                li.classList.add('theme-border');
                if (s1 < 10) {
                    h = '0' + s1;
                } else {
                    h = s1
                };
                if (s2 < 10) {
                    m = '0' + s2;
                } else {
                    m = s2;
                };
                li.innerHTML = h + ':' +m;
                this.addTimeClick(li, ul);
                ul.appendChild(li);
                s2 = 30;
            }

            div.classList.add('time');
            div.appendChild(ul);
            obj.nodeT.appendChild(div);
        },
        addTimeClick: function (node, ul) {
            var lis = ul.getElementsByTagName('li');
            node.addEventListener('click', function () {
                for (var i = 0, length = lis.length; i < length; i +=1) {
                    if (lis[i].classList.contains('theme-bg')) {
                        lis[i].classList.remove('theme-bg');
                        lis[i].classList.add('theme-color');
                        lis[i].classList.add('theme-border');
                    };
                };
                this.classList.remove('theme-color');
                this.classList.remove('theme-color');
                this.classList.add('theme-bg');
            })
        },
        renderTimeButton: function (fn) {
            var div = document.createElement('div');
            var button = document.createElement('button');
            div.classList.add('btn-box');
            button.classList.add('handleOk');
            button.classList.add('theme-bg');
            button.innerHTML = '确定';
            button.addEventListener('click', function () {
                var parentNode = this.parentNode.parentNode.parentNode;
                while (parentNode.childNodes[0]) {
                    parentNode.removeChild(parentNode.childNodes[0]);
                }
                fn && fn();
            });
            div.appendChild(button);
            obj.nodeT.appendChild(div);
        }
    };

    root[__DEFAULT__.plugName] = PlugCode;

})(this);