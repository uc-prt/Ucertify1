
import { AH } from "./HelperAI.svelte";
import JS from '../src/libs/jslib';
const ITEMPLAYER = {};
const tabindex = {
    z: 1,
    n: "-1"
}
const DOWNLOAD_ASSETS_URL = '//s3.amazonaws.com/jigyaasa_download/';
const DOWNLOAD_IMAGE_URL = '//s3.amazonaws.com/jigyaasa_content_static/';
const iframe_title = {
    '0': 'Inline Player',
    'object3d': '3-D Object Viewer',
    'brain_games': 'Brain Games',
    'quiz': 'Quiz Player',
    'wguvideo': 'Video Player',
    'flashcard': 'Flashcard Player',
    'external': 'Simulation Player',
    'video': 'Video Player',
    'pdf': 'PDF Viewer'
};
let DEFAULTMATHOPTIONS = {
    delimiters: [
        { left: '\\begin{equation}', right: '\\end{equation}', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true }
    ],
    macros: {
        '\\mbox': '',
        '$': '\\$'
    },
    ignoredTags: ["script", "noscript", "style", "textarea", "code", "option"],
};

ITEMPLAYER.download = function (player, asset, title, description, img) {
    let r = new RegExp('^(?:[a-z]+:)?//', 'i');
    let ASSET_URL = r.test(asset) ? asset : DOWNLOAD_ASSETS_URL + asset;
    let download_html = '<div class="row download_asset"><table class="border"><tbody><tr><td class="align-middle span1"><img src="' + DOWNLOAD_IMAGE_URL + img + '" class="img-polaroid"></td><td class="align-middle"><h3><strong>' + title + '</strong></h3><p id="descript" class="descript-downld">' + description + '</p></td><td class="align-middle span3"><a tabindex="' + tabindex.z + '" class="btn btn-primary btn-block" href="' + ASSET_URL + '" target="_blank">Download</a></td></tr></tbody></table></div>';
    if (!(player instanceof HTMLElement)) {
        player = document.querySelector(player);
    }
    player.innerHTML = download_html;
    document.querySelector('.descript-downld').style.display = 'block';
    document.querySelector('.descript-downld').style.margin = '0';
}
ITEMPLAYER.test = function (player, content_guid, player_id, asset, embed, no_of_attempts) {
    AH.ajax({
        url: baseUrl + 'index.php',
        data: { 'func': 'start_test', 'player_id': content_guid + '_' + player_id, 'assignment_code': asset, 'is_player': 1, 'embed': embed, 'no_of_attempts': no_of_attempts, 'ajax': 1 },
    }).then((data) => {
        if (data) {
            AH.insert(player, data, 'beforeend');
        }
    });
};


export const ucTimeline = {
    inViewport: function (element, detectPartial) {
        element = JS(element);
        detectPartial = (!!detectPartial);
        var viewport = JS(window),
            vpWidth = viewport.width(),
            vpHeight = viewport.height(),
            vpTop = viewport.scrollTop(),
            vpBottom = vpTop + vpHeight,
            vpLeft = viewport.scrollLeft(),
            vpRight = vpLeft + vpWidth,

            elementOffset = element.offset(),
            elementTopArea = elementOffset.top + ((detectPartial) ? element.height() : 0),
            elementBottomArea = elementOffset.top + ((detectPartial) ? 0 : element.height()),
            elementLeftArea = elementOffset.left + ((detectPartial) ? element.width() : 0),
            elementRightArea = elementOffset.left + ((detectPartial) ? 0 : element.width());
        return ((elementBottomArea <= vpBottom) && (elementTopArea >= vpTop)) && ((elementRightArea <= vpRight) && (elementLeftArea >= vpLeft));
    },
    ucNewSlideshow: function () {
        var divSlide = document.querySelectorAll('#columnize #slide');
        var myNodeList = divSlide.length;
        for (var i = 0; i < myNodeList; i++) {
            if (!divSlide[i].closest('#authoringSection')) {
                var type = divSlide[i].getAttribute('type');
                if (type == 'slideshow') {
                    var timeline = divSlide[i];

                    JS('#previewSection [type=slideshow] section').not(JS('#previewSection #columnize [type=slideshow] section')).addClass('carousel-item top48');
                    JS('#previewSection [type=slideshow] section header').not(JS('#previewSection #columnize [type=slideshow] section header')).addClass('tip-c mt-mdx');
                    JS('#previewSection [type=slideshow] section article').not(JS('#previewSection #columnize [type=slideshow] section article')).addClass('tip-c mt-mdx');
                    JS('#previewSection [type=slideshow]').not(JS('#previewSection #columnize [type=slideshow]')).each(function (i, ele) {
                        if (JS('#columnize [type=slideshow]').children('BR')) {
                            JS('#columnize [type=slideshow]').children('BR').remove();
                        }
                        JS(ele).children('section:first').addClass('active');
                    });

                    timeline.insertAdjacentHTML('afterbegin', '<a class="carousel-control-prev index2 width1" href="#myCarousel" data-slide="prev"> <span class="carousel-control-prev-icon icomoon-arrow-left ann_text text-body fa.s7"></span> </a>');
                    timeline.insertAdjacentHTML('afterbegin', '<a class="carousel-control-next index2 width1" href="#myCarousel" data-slide="next"> <span class="carousel-control-next-icon icomoon-arrow-right-2 ann_text text-body fa.s7"></span> </a>');
                    JS('#previewSection [type=slideshow]').wrapInner('<div class=\'carousel slide\' id=\'myCarousel\' data-ride=\'carousel\'></div>');
                    JS('#previewSection [type=slideshow] section').wrapAll('<div class=\'carousel-inner overflow-initial min_height_352\' type=\'slideshow\'></div>');
                }
            }
        }
    },
    ucNewSubSlideshow: function () {
        let divSlide = JS('#columnize #slide');
        let myNodeList = divSlide.length;
        let slideNoSub = 1;
        let showSlideNumber = 1;
        if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof JS.browser !== 'undefined' && JS.browser.msie == 1)) {
            if (JS('#columnize div[type = "sub-slideshow"]').find('.ucie_subslider').length < 0) {
                JS('#columnize div[type = "sub-slideshow"]').append('<div class="ucie_subslider"><input type="range" min="0" max="100" value="0" id="myRange" class="uc_input_slider ucie_input_slider"></div>');
            }
        } else {
            if (JS('#columnize div[type = "sub-slideshow"]').find('.uc_subslider').length < 0) {
                JS('#columnize div[type = "sub-slideshow"]').append('<div class="uc_subslider ml-sm mr-sm"><input type="range" min="0" max="100" value="0" id="myRange" class="uc_input_slider"></div>');
            }
        }
        let i;
        for (i = 0; i < myNodeList; i++) {
            let type = divSlide[i].getAttribute('type');
            if (type == 'sub-slideshow') {
                let timeline = divSlide[i];
                JS('#columnize [type=sub-slideshow] section').not(JS('#authoringSection #columnize div[type = \'sub-slideshow\'] section')).addClass('hideClass');
                JS('#columnize [type=sub-slideshow]').not(JS('#authoringSection #columnize div[type = \'sub-slideshow\']')).each(function (i, ele) {
                    if (JS('#columnize [type=sub-slideshow]').children('BR')) {
                        JS('#columnize [type=sub-slideshow]').children('BR').remove();
                    }

                    JS(ele).children('section:first').removeClass('hideClass').addClass('active');
                });
                let stepsData = JS('#columnize div[type = "sub-slideshow"] section').not(JS('#authoringSection #columnize div[type = \'sub-slideshow\'] section'));
                for (i = 0; i < stepsData.length; i++) {
                    stepsData[i].setAttribute('id', 'uc_subslide_section_' + i);
                }

                let calculateStep = 100 / (stepsData.length - 1);
                JS('.uc_input_slider').attr('step', calculateStep.toFixed(2));
                if (JS('.widthRowTwo').length < 2) {
                    timeline.insertAdjacentHTML('afterbegin', '<div class="row widthRowTwo"><div class="col-lg-12 row pr-0"><div class="np classText col-4 col-xs-4 col-md-4 col-lg-4"><a class="left uc_sub_prev carousel-control" href="#myCarousel" data-slide="prev"><span class="btn btn-primary">&larr; Previous</span></a></div><div class=" col-4 col-xs-4 col-md-4 col-lg-4 uc_sub_margin"><span class="uc_show_progress">' + showSlideNumber + '/' + JS('#columnize').find('[type=sub-slideshow]').children('section').length + '</span></div><div class="np classTextRight col-4 col-xs-4 col-md-4 col-lg-4 pr-0"><a class="right uc_sub_next  carousel-control" href="#myCarousel" data-slide="next"><span class="btn btn-primary">Next &rarr;</span></a></div></div></div>');
                }
                if (JS('.widthRow').length < 2) {
                    JS('#columnize div[type = "sub-slideshow"]').append('<div class="row widthRow"><div class="col-lg-12 row pr-0"><div class="np classText col-4 col-xs-4 col-md-4 col-lg-4"><a class="left uc_sub_prev uc_subprev_bottom carousel-control" href="#myCarousel" data-slide="prev"><span class="btn btn-primary">&larr; Previous</span></a></div><div class="col-4 col-xs-4 col-md-4 col-lg-4 uc_sub_margin"><span class="uc_showprogress_bottom">' + showSlideNumber + '/' + JS('#columnize').find('[type=sub-slideshow]').children('section').length + '</span></div><div class="np classTextRight col-4 col-xs-4 col-md-4 col-lg-4 pr-0"><a class="right uc_sub_next uc_subnext_bottom  carousel-control" href="#myCarousel" data-slide="next"><span class="btn btn-primary">Next &rarr;</span></a></div></div></div>');
                }
            }
        }

        JS('.uc_input_slider').bind('click', function () {
            let valueStep = JS(this).val();
            let stepsData = JS('#columnize div[type = "sub-slideshow"] section').not(JS('#authoringSection #columnize div[type = \'sub-slideshow\']')).length - 1;
            let calculateStep = 0;
            if (valueStep == 0) {
                calculateStep = 0;
            } else {
                calculateStep = Math.ceil((valueStep * stepsData) / 100);
            }
            let sectionData = JS('#columnize div[type = "sub-slideshow"] section').not(JS('#authoringSection #columnize div[type = \'sub-slideshow\'] section'));
            let i;
            for (i = 0; i < sectionData.length; i++) {
                let checkSection = sectionData[i].id.substr(20);
                if (calculateStep == checkSection) {
                    showSlideNumber = calculateStep + 1;
                    let totChild = JS('#columnize div[type = "sub-slideshow"] section').not(JS('#authoringSection #columnize div[type = \'sub-slideshow\'] section'));
                    for (i = 0; i < totChild.length; i++) {
                        if (totChild[i].getAttribute('class').indexOf('active') != -1) {
                            slideNoSub = i + 1;
                            let current = JS('#' + totChild[i].id);
                            current.removeClass('active');
                            current.removeClass('fadeInLeft');
                            current.removeClass('fadeInRight');
                            current.addClass('hideClass');
                        }
                    }
                    let prevEl = sectionData[i].id;
                    JS('#' + prevEl).addClass('active');
                    JS('#' + prevEl).addClass('animated');
                    JS('#' + prevEl).addClass('fadeInLeft');
                    JS('#' + prevEl).removeClass('hideClass');
                    if (JS(this).parents('#previewSection').length > 0) {
                        document.querySelector('#previewSection .uc_show_progress').innerHTML = showSlideNumber + '/' + totChild.length;
                        document.querySelector('#previewSection .uc_showprogress_bottom').innerHTML = showSlideNumber + '/' + totChild.length;
                    } else {
                        document.querySelector('#columnize .uc_show_progress').innerHTML = showSlideNumber + '/' + totChild.length;
                        document.querySelector('#columnize .uc_showprogress_bottom').innerHTML = showSlideNumber + '/' + totChild.length;
                    }
                    JS('.uc_input_slider').attr('value', valueStep);
                }
            }
        });

        JS('.uc_sub_prev').bind('click', function () {
            let select = JS('#columnize div[type = "sub-slideshow"]').not(JS('#authoringSection #columnize div[type = \'sub-slideshow\']'));
            let totChild = select.children('section');
            for (let i = 0; i < totChild.length; i++) {
                if (totChild[i].getAttribute('class').indexOf('active') != -1) {
                    slideNoSub = i + 1;
                }
            }
            let current = select.children('.active');
            let prevEl = current.prev('section');
            if (slideNoSub == totChild.length || slideNoSub >= 1) {
                if (prevEl.length == 1) {
                    showSlideNumber--;
                    prevEl = current.prev();
                    current.removeClass('active');
                    current.removeClass('fadeInLeft');
                    current.removeClass('fadeInRight');
                    current.addClass('hideClass');
                    prevEl.addClass('active');
                    prevEl.addClass('animated');
                    prevEl.addClass('fadeInLeft');
                    prevEl.removeClass('hideClass');
                } else {
                    showSlideNumber = 4;
                    current.removeClass('active');
                    current.removeClass('fadeInLeft');
                    current.removeClass('fadeInRight');
                    current.addClass('hideClass');
                    prevEl = JS('#columnize div[type = "sub-slideshow"]').children('section:last').addClass('active');
                    prevEl = JS('#columnize div[type = "sub-slideshow"]').children('section:last').addClass('animated');
                    prevEl = JS('#columnize div[type = "sub-slideshow"]').children('section:last').addClass('fadeInLeft');
                    prevEl = JS('#columnize div[type = "sub-slideshow"]').children('section:last').removeClass('hideClass');
                }
            } else {
                slideNoSub = 1;
            }
            if (JS(this).parents('#previewSection').length > 0) {
                document.querySelector('#previewSection .uc_show_progress').innerHTML = showSlideNumber + '/' + totChild.length;
                document.querySelector('#previewSection .uc_showprogress_bottom').innerHTML = showSlideNumber + '/' + totChild.length;
            } else {
                document.querySelector('#columnize .uc_show_progress').innerHTML = showSlideNumber + '/' + totChild.length;
                document.querySelector('#columnize .uc_showprogress_bottom').innerHTML = showSlideNumber + '/' + totChild.length;
            }
            let stepsData = JS('#columnize div[type = "sub-slideshow"] section').not(JS('#authoringSection #columnize div[type = \'sub-slideshow\'] section')).length - 1;
            let calculateStep = 0;
            if (showSlideNumber == 1) {
                calculateStep = 0;
            } else {
                calculateStep = (((showSlideNumber - 1) / stepsData) * 100);
            }
            JS('.uc_input_slider').attr('value', calculateStep);
        });
        JS('.uc_sub_next').bind('click', function () {
            let select = JS('#columnize div[type = "sub-slideshow"]').not(JS('#authoringSection #columnize div[type = \'sub-slideshow\']'));
            let totChild = select.children('section');
            for (let i = 0; i < totChild.length; i++) {
                if (totChild[i].getAttribute('class').indexOf('active') != -1) {
                    slideNoSub = i + 1;
                }
            }
            let current = select.children('.active');
            let prevEl = current.next('section');
            if (slideNoSub < totChild.length) {
                if (prevEl.length == 1) {
                    showSlideNumber++;
                    prevEl = current.next();
                    current.removeClass('active');
                    current.removeClass('fadeInRight');
                    current.removeClass('fadeInLeft');
                    current.addClass('hideClass');
                    prevEl.addClass('animated');
                    prevEl.addClass('fadeInRight');
                    prevEl.addClass('active');
                    prevEl.removeClass('hideClass');
                } else {
                    showSlideNumber = 1;
                    current.removeClass('active');
                    current.removeClass('fadeInRight');
                    current.removeClass('fadeInLeft');
                    current.addClass('hideClass');
                    prevEl = JS('#columnize div[type = "sub-slideshow"]').children('section:first').addClass('animated');
                    prevEl = JS('#columnize div[type = "sub-slideshow"]').children('section:first').addClass('fadeInRight');
                    prevEl = JS('#columnize div[type = "sub-slideshow"]').children('section:first').addClass('active');
                    prevEl = JS('#columnize div[type = "sub-slideshow"]').children('section:first').removeClass('hideClass');
                }
            } else {
                slideNoSub = 1;
            }
            if (JS(this).parents('#previewSection').length > 0) {
                document.querySelector('#previewSection .uc_show_progress').innerHTML = showSlideNumber + '/' + totChild.length;
                document.querySelector('#previewSection .uc_showprogress_bottom').innerHTML = showSlideNumber + '/' + totChild.length;
            } else {
                document.querySelector('.uc_show_progress').innerHTML = showSlideNumber + '/' + totChild.length;
                document.querySelector('.uc_showprogress_bottom').innerHTML = showSlideNumber + '/' + totChild.length;
            }
            let stepsData = JS('#columnize div[type = "sub-slideshow"] section').not(JS('#authoringSection #columnize div[type = \'sub-slideshow\'] section')).length - 1;
            let calculateStep = 0;
            if (showSlideNumber == 1) {
                calculateStep = 0;
            } else {
                calculateStep = (((showSlideNumber - 1) / stepsData) * 100);
            }
            JS('.uc_input_slider').attr('value', calculateStep);
        });
    },
    ucInit: function () {
        ucTimeline.ucNewSlideshow();
        ucTimeline.ucNewSubSlideshow();
    }
};

export function initEbookInteractivity() {
    AH.selectAll('.drop_list3').forEach((_this) => {
        AH.find(_this, 'dd', { action: 'hide' });
    });
    AH.bind('.drop_list3 dt a', 'click', function (event) {
        let el = event.target, parent = event.target.closest('.drop_list3');
        if (el.classList.contains('active')) {
            AH.find(parent, 'dd').slideToggle();
            el.classList.remove('active');
        } else {
            AH.find(parent, 'dd').slideToggle();
            el.classList.add('active');
        }
        return false;
    });

    AH.selectAll('table[table_caption]').forEach(function (currenttab) {
        var tabTextshow = currenttab.getAttribute('table_caption');
        AH.insert(currenttab, '<div class=\'table_capt_center\'>' + tabTextshow + '</div>', 'afterend');
    });
    //@SAQUIB: uccaption taking extra margin with prettyprint
    AH.selectAll('uc\\:caption').forEach(function (_this) {
        let currentPrev = _this.previousElementSibling;
        if (currentPrev && currentPrev.nodeName != 'undefined') {
            if ((currentPrev.nodeName == 'PRE' && currentPrev.classList.contains('prettyprint')) || currentPrev.classList.contains('pre-block')) {
                _this.style.paddingTop = '0';
            }
        }
    });
    //JS("#columnize table").wrap("<div class='overflow'></div>");
    if (AH.selectAll('.timeline.timeline-view').length > 0) {
        AH.select('.timeline.timeline-view', 'css', { width: AH.select('.center-block.flex').clientWidth });
    }

    AH.bind('.horizontal_timeline li div:last-child', 'mouseover', function (event) {
        AH.selectAll(event.target, 'removeClass', 'timeline_clamp');
    });
    AH.bind('.horizontal_timeline li div:last-child', 'mouseout', function (event) {
        AH.selectAll(event.target, 'addClass', 'timeline_clamp');
    });
    AH.selectAll('.horizontal_timeline li div:last-child', 'addClass', 'timeline_clamp');
    var linum = AH.selectAll('.horizontal_timeline li').length;
    AH.setCss('.horizontal_timeline ul', { width: linum * 500 });

    AH.selectAll('.drop_list1 > dd', 'hide');
    AH.selectAll('.drop_list1 > dd:first-of-type', 'show');
    AH.selectAll('.drop_list1 > dt:first-of-type', 'addClass', 'accordion-active');
    AH.bind('.drop_list1 > dt', 'click', function (event) {
        let _this = event.target;
        let target = _this.nextElementSibling;
        if (!_this.classList.contains('accordion-active')) {
            AH.findChild(_this.parentElement, 'dd').slideUp();
            AH.selectAll('.drop_list1 > dt', 'removeClass', 'accordion-active');
            _this.classList.add('accordion-active');
            target.slideDown();
        }
        return false;
    });

    AH.selectAll('.drop_list4').forEach(function (_this) {
        AH.selectAll(_this.querySelector('dd'), 'hide');
    });

    AH.bind('.drop_list4 dt a', 'click', function (event) {
        var el = event.target, parent = el.closest('.drop_list4');
        if (el.classList.contains('active')) {
            parent.querySelector('dd').slideToggle();
            el.classList.remove('active');
        } else {
            parent.querySelector('dd').slideToggle();
            el.classList.add('active');
        }
        return false;
    });

    AH.selectAll('.drop_list2 > dd', 'hide');
    AH.selectAll('.drop_list2 > dd:first-of-type', 'show');
    AH.selectAll('.drop_list2 > dt:first-of-type', 'addClass', 'accordion-active');
    AH.bind('.drop_list2 > dt', 'click', function (event) {
        let _this = event.target;
        let target = _this.next();
        if (!_this.hasClass('accordion-active')) {
            _this.parent().children('dd').slideUp();
            AH.selectAll('.drop_list2 > dt', 'removeClass', 'accordion-active');
            _this.classList.add('accordion-active');
            target.slideDown();
        }
        return false;
    });
    //setSlider3dArrowPos();
    if (AH.find(document, 'div[type=timeline]', 'all').length > 1 || AH.find(document, 'div[type=slideshow]', 'all').length > 1 || AH.find(document, 'div[type=sub-slideshow]', 'all').length > 1) {
        ucTimeline.ucInit();
    }
    try {
        if (AH.find(document, '#ebook_container figure[type=\'item-annotation\']', 'all').length >= 1) {
            AH.find(document, '#ebook_container figure[type=\'item-annotation\']', 'all').forEach(function (_this, i) {
                _this.classList.add('ann_item_' + i);
                ucImageAnnotation && ucImageAnnotation.ucInit('.ann_item_' + i);
            });
        }
    } catch (e) {
        console.warn('Image Annotation Error', e);
    }

    initAccordion && initAccordion(1);
    //@saquib: Multiple Video Caraosel
    try {
        if (AH.selectAll('.base player[type=\'video\'][is_multiple=\'1\']').length > 0) {
            AH.selectAll('player[type=\'video\'][is_multiple=\'1\']').forEach(function (_this) {
                videoPlayerCaraousel.containerArray.push(
                    AH.parent(_this, '.base').getAttribute('id')
                );
            });
            videoPlayerCaraousel.containerArray = AH.unique(videoPlayerCaraousel.containerArray);
            videoPlayerCaraousel.containerArray.forEach((i) => {
                videoPlayerCaraousel.init(videoPlayerCaraousel.containerArray[i]);
            });
        }
    } catch (e) {
        console.warn(e);
    }
}

export function tag_player(obj) {
    if (typeof (obj) != 'undefined') {
        //obj = obj.querySelectorAll('player');
        obj = AH.find(obj,'player','all');
    } else {
        obj = document.querySelectorAll('player');
    }
    
    //Define Player depenencies.
    let title = '',
        case_sensitive = '',
        type = '',
        config = '',
        ques_type = '',
        options = '',
        asset = '',
        sub_type = '',
        preview_image = '',
        player_id = 0,
        description = '',
        img = '',
        player_info = '',
        embed = '',
        no_of_attempts = '',
        alt = '',
        is_review = window.is_review ? window.is_review : 0,
        is_full_url = false,
        _full_url = "",
        test_session_id = window.test_session_id ? window.test_session_id : 0,
        content_guid = window.content_guid ? window.content_guid : 0,
        group_guids = '',
        hint = '',
        hint_btn = '',
        border_check = '',
        option_attr = '',
        style_attr = '',
        guids = "",
        topology = "",
        single = "",
        style = "",
        get_guid = "",
        guid = '';
    //Iterate all player tags
    obj.forEach((_this, index) => {
        // Set Default value
        type = 'quiz';
        asset = '';
        guids = '';
        preview_image = '';
        title = '';
        options = '';
        topology = '';
        config = '';
        case_sensitive = 0;
        single = '';
        style = '';
        no_of_attempts = '';
        img = '';
        get_guid = '';
        description = '';
        alt = '';
        hint = '';
        sub_type = '';
        group_guids = '';
        hint_btn = '';
        border_check = '';
        if (_this.hasAttribute('title')) {
            title = _this.getAttribute('title');
        }
        if (_this.hasAttribute('asset')) {
            asset = _this.getAttribute('asset');
        } else if (_this.hasAttribute('guid')) {
            asset = _this.getAttribute('guid');
        }
        if (_this.hasAttribute('subtype')) {
            sub_type = _this.getAttribute('subtype');
        } else if (_this.hasAttribute('sub_type')) {
            sub_type = _this.getAttribute('sub_type');
        }
        if (_this.hasAttribute('ques_type')) {
            ques_type = _this.getAttribute('ques_type');
        }
        if (_this.hasAttribute('options')) {
            options = _this.getAttribute('options');
        }
        if (_this.hasAttribute('single')) {
            single = _this.getAttribute('single');
        }
        if (_this.hasAttribute('config')) {
            config = _this.getAttribute('config');
        }
        if (_this.hasAttribute('img')) {
            img = _this.getAttribute('img');
        } else if (_this.hasAttribute('imgsrc')) {
            img = _this.getAttribute('imgsrc');
        }
        if (_this.hasAttribute('alt')) {
            alt = _this.getAttribute('alt');
        } else if (_this.hasAttribute('alt_txt')) {
            alt = _this.getAttribute('alt_txt');
        } else if (_this.hasAttribute('imgalt')) {
            alt = _this.getAttribute('imgalt');
        }
        if (_this.getAttribute('type') != undefined) {
            type = _this.getAttribute('type').toLowerCase();
        }
        if (_this.getAttribute('topology') != undefined) {
            topology = _this.getAttribute('topology');
        }
        if (_this.getAttribute('case_sensitive') != undefined) {
            case_sensitive = _this.getAttribute('case_sensitive');
        }
        if (_this.getAttribute('ui') != undefined) {
            ui = _this.getAttribute('ui');
        }
        if (_this.innerHTML != undefined && _this.innerHTML != '') {
            description = _this.innerHTML;
        }
        if (_this.getAttribute('group_guids') != undefined) {
            group_guids = _this.getAttribute('group_guids');
        }
        if (_this.getAttribute('style') != undefined) {
            style = _this.getAttribute('style');
        }
        if (_this.getAttribute('hint') != undefined) {
            hint = _this.getAttribute('hint');
        }
        if (_this.getAttribute('no_of_attempts') != undefined) {
            no_of_attempts = _this.getAttribute('no_of_attempts');
        }
        if (_this.getAttribute('device_type') != undefined) {
            device_type = _this.getAttribute('device_type');
        }
        if (_this.getAttribute('device_name') != undefined) {
            device_name = _this.getAttribute('device_name');
        }
        if (_this.getAttribute('show_caption') != undefined) {
            show_caption = _this.getAttribute('show_caption');
        }
        if (_this.getAttribute('hide_caption') != undefined) {
            hide_caption = _this.getAttribute('hide_caption');
        }
        if (_this.getAttribute('border_check') != undefined) {
            border_check = _this.getAttribute('border_check');
        }
        if (_this.getAttribute('image_url') != undefined) {
            image_url = _this.getAttribute('image_url');
        }
        var embed = getPlayerAttrVal(_this, 'embed');
        preview_image = getPlayerAttrVal(_this, 'preview');

        domain = '';
        asset = asset.trim();
        type = type.trim();
        var extension = asset.split('.').pop();
        if (extension == 'swf' && navigator.userAgent.toLowerCase().match(/iphone|ipod|ipad/)) {
            player_info = '<h6 class="m-0"><small>This is based on the Adobe Flash and will no work on iPad or iPhone</small></h6>';
        }
        //checking absolute url
        if (asset.substr(0, 7) == 'http://' || asset.substr(0, 8) == 'https://') {
            is_full_url = true;
            var domain = asset.match(/:\/\/(www\.)?(.[^/:]+)/)[2]; //fetching domain
            //alert(domain);
        }
        var entity = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\'': '&apos;', '"': '&quot;' };
        for (var i in entity) {
            if (title.indexOf(i)) {
                title = title.replace(new RegExp(i, 'g'), entity[i]);
            }
        }
        var iframe_src, c1, c2, tag_url, self, text, tag_div, tag_html, terminal_url, intervals, attrs, player_title = title || iframe_title[type] || iframe_title['0'];

        switch (type) {
            case 'quiz':
                var quiz_attr = '';
                _this.classList.add('w-100');
                if (_this.hasAttribute('quick_feedback')) {
                    quiz_attr = '&quick_feedback=1';
                }
                if (_this.hasAttribute('random_quiz')) {
                    quiz_attr += '&random_quiz=' + _this.getAttribute('random_quiz');
                }
                if (_this.hasAttribute('algo_quiz')) {
                    quiz_attr += '&algo_quiz=' + _this.getAttribute('algo_quiz');
                }
                if (_this.hasAttribute('dont_randomize')) {
                    quiz_attr += '&dont_randomize=' + _this.getAttribute('dont_randomize');
                }
                quiz_attr += '&nofeedback=' + getPlayerAttrVal(_this, 'nofeedback');
                var chapter_guid = '';
                if (typeof ajaxEbook === 'object' && ajaxEbook['parent_guid'] !== '') {
                    chapter_guid = ajaxEbook['parent_guid'];
                }
                iframe_src = baseUrl + 'index.php?func=navigate_items&player_id=' + chapter_guid + '_' + player_id + '&group_guid=' + asset + '&chapter_guid=' + chapter_guid + '&title=' + title + '&player_setting' + options + quiz_attr + '&handler_type=quizPlayer';
                var attributes = 'class="quiz_player" name="' + chapter_guid + '_' + player_id + '" id="' + chapter_guid + '_' + player_id + '" style="' + options + '" onLoad="window.parent.autoResize(this.id, 1)"';
                AH.insert(_this, createPlayerEmbed('inline', player_title, iframe_src, attributes), 'afterbegin');
                player_id++;
                break;
            case 'flashcard':
                iframe_src = baseUrl + 'quiz_player.php?func=get_flashcard&player_id=' + content_guid + '_' + player_id + '&group_guid=' + asset + '&title=' + title + '&player_setting' + options + '&item_sequence=1';
                let tempFlashCardHtml = '<iframe tabindex=\'' + tabindex.z + '\' title=\'' + player_title + '\' class=\'quiz_player\' name=' + content_guid + '_' + player_id + ' id=' + content_guid + '_' + player_id + ' src=\'' + iframe_src + '\' style=\'' + options + '\' onLoad=\'window.parent.autoResize(this.id)\'></iframe>';
                AH.insert(_this, tempFlashCardHtml, 'afterbegin');
                player_id++;
                break;
            case 'download':
                ITEMPLAYER.download(_this, asset, title, description, img, alt);
                player_id++;
                break;
            case 'terminal':
                var include_assets = "";
                var terminalType = sub_type.toLowerCase(),
                    sequence = asset,
                    terminal_title_tag = '',
                    user = _this.getAttribute('user'),
                    default_comm = _this.getAttribute('default_comm'),
                    init_comm = _this.getAttribute('init_comm'),
                    testsession_id = window.test_session_id ? window.test_session_id : 0,
                    contentguid = window.content_guid ? window.content_guid : 0,
                    forSm = true;
                var terminalInEditor = typeof __inEditor__ == 'undefined' ? false : __inEditor__;
                if (_this.hasAttribute('guids')) {
                    asset = _this.getAttribute('guids');
                }
                if (terminalInEditor) {
                    contentguid = 0;
                }
                if (title != '') {
                    terminal_title_tag = '<div class="alert alert-info clearfix lab-title p-md">' + title + '</div>';
                }
                
                _this.classList.add('w-100');
                switch (terminalType) {
                    case 'java':
                    case 'php':
                        forSm = false;
                        let url = baseUrl + 'sim/?module=terminal_lib&type=' + terminalType;
                        if (ques_type == 'new') {
                            url += '&new=1';
                        }
                        if (single != '') {
                            _this.wrapInner('<a tabindex="' + tabindex.z + '" href="' + url + '" onclick="return open_single_lab(this)"/>');
                        } else if (asset != '') {
                            terminal_url = '';
                            if (is_review == 1 && sub_type == 'assessment') {
                                terminal_url = 'javascipt:;\' disabled=\'disabled\'';
                            } else {
                                terminal_url = url + '&full_page=1&content_guid=' + asset + '&is_overlay=1';
                            }
                            if (title == '') {
                                title = 'Try it';
                            }
                            terminal_url = 'open_test(\'' + terminal_url + '\')';
                            terminal_url = 'onclick="' + terminal_url + '"';
                            AH.find(_this?.parentElement, ".btn-primary.startlab", {action: 'remove'});
                            AH.insert(_this, '<a tabindex="' + tabindex.z + '" class="btn btn-primary startlab focus_lab" ' + terminal_url + ' target="_blank">' + title + '</a>', 'afterbegin');
                        } else {
                            _this.load(url + '&full_page=1');
                        }
                        break;
                }
                if (forSm) {
                    if (ques_type == 'sim') {
                        AH.insert(_this, '<h1>this item is depricated, please contact ucertify support</h1>', 'afterend');
                    } else {
                        if (AH.selectAll('.UC_TERMINAL').length <= 0) {
                            if (_this.hasAttribute('exclude_asset')) {
                                include_assets = '';
                            }
                            AH.insert(_this, include_assets + terminal_title_tag + '<div class="UC_TERMINAL" style="' + options + '; height:240px; width: 99%;"><div class="term_container"><div id="terminal_font"><span class="icomoon-plus plus" rel="tooltip" data-original-title="Increase font size"></span><span class="icomoon-minus minus mt" rel="tooltip" data-original-title="Decrease font size"></span></div></div></div>', 'afterbegin');
                            AH.getBS('#terminal_font span', 'Tooltip').enable();
                        }
                        if (typeof updateTFS != 'undefined') {
                            updateTFS();
                        }
                        if (typeof speechSynth != 'undefined') {
                            speechSynth._init();
                        }
                    }
                    if (is_review == 1) {
                        AH.setCss('.UC_TERMINAL', { 'background-image': 'url(' + baseThemeUrl + 'images/' + terminalType.toLowerCase() + '-terminal.png)', 'background-repeat': 'no-repeat', 'height': '180px' });
                    } else {
                        switch (terminalType) {
                            case 'dos':
                                create_dos_terminal(case_sensitive, contentguid, test_session_id, user);
                                break;
                            case 'unix':
                                if (default_comm == 1) {
                                    default_exce_comm(init_comm, user, testsession_id, contentguid);
                                }
                                create_unix_terminal(case_sensitive, user, testsession_id, contentguid);
                                break;
                        }
                    }
                }
                break;
            case 'insight':
            case 'lab':
                var insight_ui, lab_title_tag = '<div>',
                    smart_chat_url;
                if (sub_type == 'smart_chat' || sub_type == 'insight') {
                    if (sub_type == 'smart_chat') {
                        content_guid = (_this.getAttribute('content_guid')) ? _this.getAttribute('content_guid') : asset;
                        smart_chat_url = baseUrl + 'sim/smartsim/index.php?action=player&content_guid=' + content_guid + '&no_header=1';
                        if (_this.hasAttribute('skip_intro')) {
                            smart_chat_url += '&skip_intro=1';
                        }
                        insight_ui = ['smartchat-playertag', 'Start discussion', 0];
                    }
                    if (sub_type == 'insight') {
                        var insight_asset = '';
                        if (asset.length == 5) {
                            insight_asset = baseUrl + 'sim/smartsim/index.php?action=player&content_guid=' + asset + '&no_header=1&insight=1&tech=unity&insight_navigation=1';
                        }
                        smart_chat_url = insight_asset;
                        insight_ui = ['insight-playertag', 'Start', 1];
                        var insight_call = sub_type;
                    }
                    smart_chat_url = 'openOverlayWeblink(\'' + smart_chat_url + '\', ' + insight_ui[2] + ',\'' + insight_call + '\')';
                    smart_chat_url = 'onclick="' + smart_chat_url + '"';
                    if (_this.innerHTML.trim() != '') {
                        var _playerHtml = '<div tabindex=\'' + tabindex.z + '\' class=\'' + insight_ui[0] + ' pointer\' ' + smart_chat_url + '>' + _this.innerHTML + '</div>';
                        _this.innerHTML = _playerHtml;
                        _this.querySelector('img').classList.add('noImgModal');
                    } else if (_this.hasAttribute('img')) {
                        var alt = 'Introduction Slide';
                        if (_this.hasAttribute('imgalt')) {
                            alt = _this.getAttribute('imgalt');
                        }
                        _this.html('<center><div tabindex="' + tabindex.z + '" class="' + insight_ui[0] + ' " style="position:relative;display:inline-block;min-width:500px;max-width:800px;border:1px solid"><img class="noImgModal" alt="' + alt + '" src="' + DOWNLOAD_IMAGE_URL + _this.getAttribute('img') + '"/><span ' + smart_chat_url + ' class="play-video-icon pointer" style="position:absolute;z-index:10;left:50%;top:50%;margin-top:-30px;margin-left:-30px;"></span></div></center>');
                    } else {
                        smartchatbuttontext = _this.hasAttribute('text') ? _this.getAttribute('text') : insight_ui[1];
                        lab_title_tag = '<div class="alert alert-info clearfix lab-title p-md">' + title;
                        _this.innerHTML = lab_title_tag + '<a tabindex=\'' + tabindex.z + '\' class=\'btn btn-primary float-right startlab\' ' + smart_chat_url + ' target=\'_blank\'>' + smartchatbuttontext + '</a></div>';
                    }
                    player_id++;
                    break;
                }
                title = title.replace(/'/g, '&#039');
                if (sub_type == 'scorm') {
                    var image = '';
                    if (_this.hasAttribute('image') && _this.getAttribute('image') != '') {
                        image = _this.getAttribute('image');
                    } else {
                        image = img;
                    }
                    if (_this.getAttribute('get_guid') != undefined) {
                        get_guid = _this.getAttribute('get_guid');
                    } else {
                        get_guid = _this.closest('.base').getAttribute('id');
                    }
                    if (_this.hasAttribute('asset_m') && isiPad) {
                        asset = _this.getAttribute('asset_m');
                    }
                    var insight_player_vtt = '';
                    if (_this.hasAttribute('scorm_caption_id') && _this.getAttribute('scorm_caption_id') != '') {
                        insight_player_vtt = '&scorm_caption_id=' + _this.getAttribute('scorm_caption_id');
                    }
                    if (insight_player_vtt == '') {
                        insight_player_vtt = '&scorm_caption_id=' + group_guids;
                    }
                    if (isiPad) {
                        insight_player_vtt = '';
                    }
                    SCORM_url = baseUrl + 'lab_player.php?test_session_id=' + test_session_id + '&content_guid=' + content_guid + '&lab_code=' + asset + '&type=' + type + '&sub_type=' + sub_type + '&get_guid=' + get_guid + '&lab_title=' + encodeURIComponent(title) + '&SCOInst=1' + insight_player_vtt;
                    SCORM_url = 'open_test(\'' + SCORM_url + '\')';
                    SCORM_url = 'onclick="' + SCORM_url + '"';
                    AH.insert(_this, '<div style=\'left: -340px;position: relative;height: 500px;\'><a tabindex=\'' + tabindex.z + '\' id=\'scormid\' class=\'btn btn-primary float-right startlab\' ' + SCORM_url + '><img class =\'noImgModal\' alt=\'' + alt + '\' src=\'' + DOWNLOAD_IMAGE_URL + image + '\'/><span class=\'play-video-icon\' style=\'position:absolute;z-index:10;left:74.5%;top:49%;margin-top:-30px;margin-left:-30px;\'></span><div id=\'get_status\' style=\'margin-top: 7px;\'><span>Slide - 00:00:00       </span><span style=\'padding-left: 20px;\'>Lesson Status - incomplete  </span></div></a>' + '</div>', 'beforebegin');
                    var seturl = baseUrl + 'lab_player.php?action=scorm_status&get_guid=' + get_guid;
                    setTimeout(function () {
                        AH.ajax({
                            type: 'POST',
                            url: seturl,
                        }).then((res) => {
                            if (res != '') {
                                try {
                                    var st = JSON.parse(res);
                                    if (st.lessonstatus != null && st.timespent != null) {
                                        var scorm_time1 = st['timespent'];
                                        var scorm_time = scorm_time1.split(':');
                                        var update_scorm_time = (scorm_time[0].substring(2, 4)) + ':' + scorm_time[1] + ':' + Math.round(scorm_time[2]);
                                        AH.select('#get_status').innerHTML = '<span>Slide - ' + update_scorm_time + ' </span><span style=\'padding-left: 20px;\'>  Lesson Status - ' + st['lessonstatus'] + '</span>';
                                    }
                                } catch (e) {
                                    console.warn('Scorm data fetch rrror', e);
                                }
                            }
                        });
                    }, 1000);
                    break;
                }
                if (title != '') {
                    lab_title_tag = '<div class="alert alert-info clearfix lab-title p-md">' + title;
                } else {
                    lab_title_tag = '<div class="alert alert-info clearfix lab-title p-md">&nbsp; ';
                }
                var SCORM_url = '';
                if (is_review == 1 && sub_type == 'assessment') {
                    SCORM_url = 'javascipt:;\' disabled=\'disabled\'';
                } else {
                    SCORM_url = baseUrl + 'lab_player.php?test_session_id=' + test_session_id + '&content_guid=' + content_guid + '&lab_code=' + asset + '&type=' + type + '&sub_type=' + sub_type + '&lab_title=' + encodeURIComponent(title) + '&SCOInst=1';
                    if (typeof open_test == 'function') {
                        SCORM_url = 'open_test(\'' + SCORM_url + '\')';
                        SCORM_url = 'onclick="' + SCORM_url + '"';
                    } else {
                        SCORM_url = 'href="' + SCORM_url + '"';
                    }
                }
                if (typeof open_test == 'function') {
                    AH.insert(_this, lab_title_tag + '<a tabindex=\'' + tabindex.z + '\' class=\'btn btn-primary float-right startlab\' ' + SCORM_url + '>Start Lab</a>' + player_info + '</div>', 'afterend');
                } else {
                    AH.insert(_this, lab_title_tag + '<a tabindex=\'' + tabindex.z + '\' class=\'btn btn-primary float-right startlab\' ' + SCORM_url + ' target=\'_blank\'>Start Lab</a>' + player_info + '</div>', 'afterend');
                }
                break;
            case 'external':
            case 'simulation':
                var default_action = '',
                    correct_ans = '';
                self = _this;
                if (asset != '') {
                    AH.ajax({
                        url: baseUrl + 'index.php',
                        data: { 'func': 'get_item_xml', 'item_id': asset, 'ajax': 1, is_parse: 1 },
                    }).then((data) => {
                        obj = JSON.parse(data);
                        config = obj.config;
                        if (obj.default != undefined) {
                            default_action = obj.default;
                        }
                        if (obj.correct != undefined) {
                            correct_ans = obj.correct;
                        }
                        createSimulationHtml(config, default_action, correct_ans, embed, self, is_review, hint, player_id, player_title);
                        player_id++;
                    });
                } else {
                    default_action = getPlayerAttrVal(_this, 'default');
                    correct_ans = getPlayerAttrVal(_this, 'correct');
                    createSimulationHtml(config, default_action, correct_ans, embed, self, is_review, hint, player_id, player_title);
                    player_id++;
                }
                break;
            case 'annotation':
                iframe_src = baseUrl + 'quiz_player.php?player_id=' + asset + '_' + player_id + '&group_guid=' + asset + '&image_annotation=1';
                AH.insert(_this, '<iframe tabindex=\'' + tabindex.z + '\' class=\'quiz_player\' name=' + asset + '_' + player_id + ' id=' + asset + '_' + player_id + ' src=\'' + iframe_src + '\' style=\'' + options + '\' onLoad=\'window.parent.autoResize(this.id,1)\' allowfullscreen title=\'' + player_title + '\'></iframe>', 'beforeend');
                player_id++;
                break;
            case 'exhibit':
                self = this;
                var btn_style = '',
                    img_tag = '',
                    action = '',
                    bordered = getPlayerAttrVal(_this, 'bordered'),
                    show_caption = getPlayerAttrVal(_this, 'show_caption'),
                    hide_caption = getPlayerAttrVal(_this, 'hide_caption'),
                    layout = getPlayerAttrVal(_this, 'layout'),
                    is_inline = getPlayerAttrVal(_this, 'inline');
                //For old exhibit tag
                if (!_this.hasAttribute('category')) {
                    embed = 'overlay';
                    sub_type = 'image';
                    if (asset) {
                        sub_type = 'item';
                    } else {
                        sub_type = 'image';
                    }
                    if (layout != 'link') {
                        layout = 'button';
                    }
                    show_caption = title;
                }
                if (img) {
                    img = (img.indexOf('//s3.amazonaws.com') > -1) ? img : DOWNLOAD_IMAGE_URL + img;
                    img_tag = '<img src="' + img + '" alt="' + alt + '"' + (bordered ? 'class="img-bordered"' : '') + ' />';
                } else {
                    img_tag = _this.innerHTML;
                }
                if (embed == 'inline') {
                    action = 'showToggleOutput';
                } else if (embed == 'overlay') { //NOSONAR
                    action = 'scenarioAction';
                }
            
                let html_tag = is_inline ? 'span' : 'div';
            
                if (layout == 'button') {
                    btn_style = `<button type="button" class="exhibitAction btn btn-primary mb-1" action="${action}" player_id="${player_id}" data-show="${show_caption}" data-hide="${
                        hide_caption || ''
                    }" tabindex="0">${show_caption}</button>`;
                } else if (layout == 'link') { //NOSONAR
                    btn_style = `<span class="link-primary pointer exhibitAction" action="${action}" player_id="${player_id}" data-show="${show_caption}" data-hide="${
                        hide_caption || ''
                    }">${show_caption}</span>`;
                }
                if (sub_type == 'image') {
                    let button_tag = `${btn_style} <div class="pt-md h" id="player_${player_id}">${img_tag}</div>`;
                    _this.innerHTML = `<${html_tag}>${button_tag}</${html_tag}>`;
                    player_id++;
                } else if (sub_type == 'item' && asset) {
                    var old_player_id = player_id, old_assest = asset;
                    AH.ajax({
                        url: baseUrl + 'index_data.php?func=get_exhibit',
                        data: { 
                            'guid': asset, 
                            'ajax': 1 
                        },
                    }).then((res) => {
                        const exhibitItem = res;
                        if (embed == 'overlay') {
                            _this.innerHTML = `<${html_tag}>${btn_style}<div class="pt h text-left" id="player_${player_id}">${exhibitItem}</div></${html_tag}>`;
                        } else {
                            _this.innerHTML = `<${html_tag}>${btn_style}<div class="bg-lighter-blue blue_border px-2 pb-2 h" id="player_${player_id}">
                            <span class="close font28 pointer float-end me-2" action="${action}">&times;</span>${exhibitItem}</div></${html_tag}>`;
                            document.querySelector(`#player_${player_id} span.close`).addEventListener('click', () =>
                                exhibitAction('showToggleOutput', player_id)
                            );
                        }
                        player_id++;
                    }).catch(function() {
                        console.log("error");
                    });;
                } else if (sub_type == 'text') {
                    let text = _this.attributes?.text?.value;
                    let span_tag = '';

                    if (embed == 'inline') {
                        btn_style = layout == 'button' ? 'btn btn-primary' : 'link-primary pointer';
                        hide_caption = hide_caption || show_caption;

                        span_tag = `<span class="${btn_style} nohover ${sub_type} exhibitAction" action="${action}" embed="inline" guid="sample" data-show="${show_caption}" data-hide="${
                            hide_caption || ''
                        }" layout="button" tabindex="0" player_id="${player_id}">${show_caption}</span><div class="span-inline h pt" id="player_${player_id}">${text}</div>`;
                    } else {
                        span_tag = `${btn_style} <div class="h" id="player_${player_id}">${text}</div>`;
                    }
                    _this.innerHTML = span_tag;
                    player_id++;
                }
                break;
            case 'playground':
                var isEval = _this.getAttribute('isEval') ? _this.getAttribute('isEval') : 0;
                var theme = _this.getAttribute('theme') ? _this.getAttribute('theme') : 0;
                var title = (title != '') ? title : 'Try it yourself';
                self = _this;
                let web_count = 0;
                web_count += 1;
                _this.classList.add('w-100');
                if (asset != '') {
                    AH.ajax({
                        url: baseUrl + 'index.php',
                        data: { 'func': 'get_item_xml', 'item_id': asset, 'ajax': 1 },
                    }).then((data) => {
                        createPlaygroundHtml(data, isEval, theme, web_count, self, title);
                        player_id++;
                    });
                } else {
                    var smxml = _this.querySelector('playcode').textContent;
                    smxml = smxml.replace(/#lt#/g, '<').replace(/#gt#/g, '>').replace(/#nl#/g, '\n').replace(/#t#/g, '\t').replace(/#s#/g, '  ');
                    createPlaygroundHtml(smxml, isEval, theme, web_count, self, title);
                    player_id++;
                }
                break;
            case 'video':
                _this.classList.add('w-100');
                if (_this.hasAttribute('security')) {
                    wguVideoPlayer(_this, player_title);
                    player_id++;
                    break;
                }
                if (_this.hasAttribute('stepcaptions')) {
                    intervals = getPlayerAttrVal(_this, 'intervals');
                    stepplayer(_this, asset, title, intervals, _this.getAttribute('stepcaptions'));
                    player_id++;
                    break;
                }
                var video_title_tag = '', video_alt = '', no_title = false;
                //Do not show title if notitle is added in player tag
                no_title = getPlayerAttrVal(_this, 'notitle');
                if (title.trim() == '') {
                    no_title = true;
                }
                if (!no_title) {
                    if (title != '') {
                        title = replaceLTGT(title);
                        var title_span = `<span titleid = "${player_id}" class="video-player-title"></span>`;
                        video_title_tag = `<div class="mb-xl alert alert-info lab-title p-md"><span class="icomoon-camera-8 pr-2"></span>${title_span + player_info}</div>`;
                    } else if (player_info != '') {
                        video_title_tag = `<div class="mb-xl alert alert-info lab-title p-md"><span class="icomoon-camera-8 pr-2"></span>Video${player_info}</div>`;
                    }
                }

                if (sub_type == 'video_plus') {
                    c1 = (asset.indexOf('.') == -1);
                    c2 = (asset.indexOf('youtube') > 1);
                    if ((!is_full_url && c1) || c2) {
                        sub_type = 'youtube';
                    }
                }
                if (sub_type == 'youtube') {
                    if (asset.indexOf('youtube') > -1) {
                        var match = asset.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);
                        asset = (match && match[7].length == 11) ? match[7] : false;
                    }
                }
                if (sub_type == '' && (asset.indexOf('jigyaasa.info') > -1 || asset.indexOf('ucertify.com') > -1)) {
                    AH.insert(_this, video_title_tag + '<center><div class="bg-black ml-md"><video class="outline0" controls name="media"><source src="' + asset + '" type="video/mp4"></video></div></center>', 'beforeend');
                } else if (sub_type == 'video_plus') {
                    if (!preview_image || preview_image == '') {
                        preview_image = asset.replace(extension, 'png');
                        if (preview_image.indexOf('s3.amazonaws.com') > -1) {
                            preview_image = preview_image.split('jigyaasa_content_stream/').pop();
                        }
                    }
                    preview_image = (preview_image.indexOf('vimeocdn') == -1) ? DOWNLOAD_IMAGE_URL + preview_image : preview_image;
                    try {
                        group_guids = group_guids.trim();
                    } catch (err) {
                        console.warn(err);
                    }
                    if(!group_guids){
                        group_guids += `${window.content_guid}`;
                    }
                    var v_plus_id = 'v-plus-preview' + group_guids, bg_zoom = '';
                    var v_plus_previewbox_class = 'col-md-7 col-12 p-0';
                    var v_plus_previewbox2_class = 'col-md-5 col-sm-12 col-12 p-0';
                    var framework = '';
                    var vtt_preview_html = '<div class="pb-md pl-lg pr-md v-transcript-container clearboth h-100"></div>';
                    if (typeof page !== 'undefined' && page == 'pe-virtual_lab') {
                        v_plus_previewbox_class = 'col-md-12';
                        v_plus_previewbox2_class = 'col-md-12 mt-md';
                        bg_zoom = '50%'; framework = page;
                    }
                    if (getTestFrameworkDetail() === 'split') {
                        v_plus_previewbox_class = 'col-md-12';
                        v_plus_previewbox2_class = 'col-md-12 mt-md';
                        bg_zoom = '60%';
                        framework = 'pe-virtual_lab';
                        vtt_preview_html = '';
                    }
                    var add_class = (_this.hasAttribute('is_multiple') && _this.getAttribute('is_multiple') == 1) ? 'class="mx-auto width10"' : '';
                    var v_plus_preview_html = '<center cid="' + v_plus_id + '" style="display:flex;" ' + add_class + '><iframe id="' + v_plus_id + '" title="' + player_title + '" src="' + baseUrl + 'utils/video_plus/index.php?content_guid=' + group_guids + '&no_header=1&question=1&img=' + preview_image + '&framework=' + framework + '" loading="eager" class="w-100"></iframe></center>';
                    AH.insert(_this, video_title_tag + v_plus_preview_html, 'beforeend');
                    var v_p_url = 'url("' + preview_image + '")';
                    //_this.find('.v-container').css({ 'background-image': v_p_url, 'zoom': bg_zoom });
                    AH.select('.v-container','css',{backgroundImage:v_p_url,zoom: bg_zoom});
                } else {
                    if (is_full_url && asset.indexOf('vimeo') == -1 && sub_type != 'youtube') {
                        var _asset = (sub_type == 'hostedvideo') ? asset : asset + '?vq=hd1080';
                        AH.insert(_this, video_title_tag + '<center><iframe tabindex="' + tabindex.z + '" style="' + options + '" class="video_frame" src="' + _asset + '" frameborder="0" title="' + player_title + '" allowfullscreen></iframe></center>', 'afterbegin');
                    } else if (domain == 'youtube' || sub_type == 'youtube') {
                        AH.insert(_this, video_title_tag + '<center><iframe tabindex="' + tabindex.z + '" style="' + options + '" class="video_frame" src="https://www.youtube.com/embed/' + asset + '?vq=hd1080' + '" frameborder="0" title="' + player_title + '" allowfullscreen></iframe></center>', 'afterbegin');
                    } else if (domain == 'lynda' || sub_type == 'lynda') {
                        AH.insert(_this, video_title_tag + '<center><iframe tabindex="' + tabindex.z + '" style="' + options + '" class="video_frame" src="//www.lynda.com/player/embed/' + asset + '?fs=3&ps=paused&utm_medium=referral&utm_source=embed+video&utm_campaign=ldc-website&utm_content=vid-' + asset + '" mozallowfullscreen="true" webkitallowfullscreen="true" allowfullscreen="true" frameborder="0" title="' + player_title + '"></iframe></center>', 'afterbegin');
                    } else if (extension != '') {
                        _full_url = '';
                        if (!preview_image || preview_image == '') {
                            preview_image = asset.replace(extension, 'png');
                            if (preview_image.indexOf('s3.amazonaws.com') > -1) {
                                preview_image = preview_image.split('jigyaasa_content_stream/').pop();
                            }
                        }
                        if (!is_full_url && asset.indexOf('vimeo') == -1 && asset.indexOf('s3.amazonaws.com') == -1) {
                            _full_url = '//s3.amazonaws.com/jigyaasa_content_stream/';
                        }
                        if (typeof _this.getAttribute('alt') == 'undefined') {
                            video_alt = 'Click to play video';
                        } else {
                            video_alt = (_this.getAttribute('alt') == '') ? 'Click to play video' : _this.getAttribute('alt');
                        }
                        preview_image = (preview_image.indexOf('vimeocdn') == -1) ? DOWNLOAD_IMAGE_URL + preview_image : preview_image;
                        var new_player_id = player_id;
                        if (AH.selectAll('#video_player_' + player_id).length > 0) {
                            new_player_id = player_id + Math.floor(Math.random() * 90 + 10);
                        }
                        AH.insert(_this, video_title_tag + '<center><video class="outline0" controls name="media"  id="video_player_' + new_player_id + '" poster="'+preview_image+'"><source src="' + _full_url + asset + '" type="video/mp4"></video></center>', 'afterbegin');
                    }
                }
                AH.find(_this, `[titleid="${player_id}"]`, { action: 'html', actionData: title })
                player_id++;
                break;
            case 'audio':
                _this.classList.add('w-100');
                var audio_title_tag = '';
                if (title != '') {
                    audio_title_tag = '<div class="mb-xl alert alert-info lab-title p-xl"><span class="icomoon-play-3 mr"></span>' + title;
                }
                if (!is_full_url) {
                    asset = '//s3.amazonaws.com/jigyaasa_content_stream/' + asset;
                }
                AH.insert(_this, audio_title_tag + '<audio controls="controls" class="position-absolute right5 bottom6 mb-1"><source src="' + asset + '" type="audio/mpeg"></audio></div>', 'beforeend');
                break;
            case 'pdf':
                _this.classList.add('w-100');
                var pdf_url, download_html, des_css = (description == '') ? { 'display': 'none' } : { 'display': 'block', 'margin': '0' };
                if (asset.match('^https://')) {
                    asset = asset.replace('https://', 'http://');
                }
                embed = (embed == '') ? 'player' : embed;
                if (embed != '' || embed != 'inline') {
                    var img = '//s3.amazonaws.com/jigyaasa_content_static/pdf_0003m4.png',
                        content_guid = _this.closest('.base').getAttribute('id');
                    if (embed == 'overlay') {
                        download_html = '<div class="row download_asset"><table class="border"><tbody><tr><td style="width:150px" class="align-middle"><img src="' + img + '" class="img-polaroid"></td><td class="align-middle"><h3>' + title + '</h3><p class="descript-pdf">' + description + '</p></td><td class="align-middle span3"><a tabindex="' + tabindex.z + '" class="btn btn-primary btn-block" onclick="open_test(\'' + baseUrl + 'utils/pdf/?filename=' + asset + '&content_guid=' + content_guid + '\')">Open</a></td></tr></tbody></table></div>';
                        _this.innerHTML = download_html;
                    } else if (embed == 'player') {
                        if (isiPad) {
                            pdf_url = 'http://docs.google.com/gview?url=' + asset + '&embedded=true';
                            AH.setCss('player[type="pdf"]', { 'position': 'relative', 'top': '-30px' });
                        } else {
                            pdf_url = baseUrl + 'labs/?destination=' + asset + '#zoom=100';
                        }
                        if (document.documentMode || /Edge/.test(navigator.userAgent)) {
                            download_html = '<div class="row download_asset"><table class="border"><tbody><tr><td style="width:150px" class="align-middle"><img src="' + img + '" class="img-polaroid"></td><td class="align-middle"><h3>' + title + '</h3><p class="descript-pdf">' + description + '</p></td><td class="align-middle span3"><a tabindex="' + tabindex.z + '" class="btn btn-primary btn-block" href="' + pdf_url + '" target="_blank">Open</a></td></tr></tbody></table></div>';
                        } else {
                            download_html = '<iframe tabindex=\'' + tabindex.z + '\' onLoad = \'window.parent.ucPdfLoad(this.id)\' frameborder=\'0\' scrolling=\'auto\' style=\'height:400px;\' class=\'quiz_player download_asset\' name=\'pdf' + content_guid + '\' id=\'pdf' + content_guid + '\' src=\'' + pdf_url + '\' title=\'' + player_title + '\'></iframe>';
                        }
                        _this.innerHTML = download_html;
                    } else {
                        download_html = '<div class="row download_asset"><table class="border"><tbody><tr><td style="width:150px" class="align-middle"><img src="' + img + '" class="img-polaroid"></td><td class="align-middle"><h3>' + title + '</h3><p class="descript-pdf">' + description + '</p></td><td class="align-middle span3"><a tabindex="' + tabindex.z + '" class="btn btn-primary btn-block" href="' + baseUrl + 'utils/pdf/?filename=' + asset + '&content_guid=' + content_guid + '" target="_blank">Open</a></td></tr></tbody></table></div>';
                        _this.innerHTML = download_html;
                    }
                }
                AH.setCss('.descript-pdf', des_css);
                player_id++;
                break;
            case 'weblink':
                var frame_height = getPlayerAttrVal(_this, 'height'),
                    frame_width = (sub_type == 'embed' || embed == 'inline') ? '100%' : getPlayerAttrVal(_this, 'width');
                _this.classList.remove('w-100');
                if (sub_type == 'embed' || embed == 'inline') {
                    _this.classList.add('w-100');
                    frame_height = (frame_height == '') ? '500px' : frame_height;
                    AH.insert(_this, '<center><div class=\'weblinkContainer overflow-auto\' style=\'position:relative;height:' + frame_height + ';width:' + frame_width + '\' id=\'weblinkEmbed_' + player_id + '\'><iframe src=\'' + asset + '\' height=\'100%\' width=\'' + frame_width + '\' allowfullscreen=\'true\' class=\'weblink_player\' id=\'weblinkFrame_' + player_id + '\'></iframe><button id="fullScreenButton" class=\'bg-light\' title=\'Full Screen\' onclick=\'functionForFullscreen(weblinkFrame_' + player_id + ')\' rel=\'tooltip\' style=\'position:absolute;top:0;right:0;border:0;padding:10px\'><i class=\'icomoon-new-24px-expand-1 fullScreenIcon\' /><span class=\'fullscreenBtn pl-md align-top pull-right\'>Full Screen</span></button></div></center>', 'beforeend');
                    player_id++;
                    break;
                }
                if (sub_type == 'redirect' || embed == 'new_tab') {
                    asset = baseUrl + 'labs/?destination=' + asset;
                }
                var player_txt = _this.innerHTML || '',
                    html_arr = [];
                var center_tag = (player_txt == '') ? ['<center>', '</center>'] : ['', ''];
                html_arr[0] = center_tag[0] + '<a tabindex="' + tabindex.z + '" class="weblink" style="position:relative;display:inline-block;min-width:166px;max-width:860px;cursor:pointer" href="' + asset + '" title="' + title + '" target="_blank">';
                if (_this.hasAttribute('icon') && _this.getAttribute('icon') !== '') {
                    html_arr[1] = '<span class="' + _this.getAttribute('icon') + ' s8 float-left"></span>';
                } else {
                    html_arr[1] = (img === '') ? '' : '<img class ="noImgModal" title="Click to open Link" src="' + DOWNLOAD_IMAGE_URL + img + '" alt="' + alt + '" style="height:' + frame_height + '; max-width:' + frame_width + '; margin-right:10px"/>';
                }
                var frame_align = (player_txt == '') ? '' : 'tip-c';
                if (html_arr[1] == '') frame_align = '';
                html_arr[2] = `<div class="${frame_align}">${player_txt}</div></a>${center_tag[1]}`;
                _this.innerHTML = html_arr.join('');
                if (_this.hasAttribute('overlay') && _this.getAttribute('overlay') == '1') {
                    _this.querySelector('.weblink').classList.add('overlay');
                }
                if (_this.hasAttribute('innewwindow') && _this.getAttribute('innewwindow') == '1') {
                    _this.querySelector('.weblink').classList.add('innewwindow');
                }
                if (_this.hasAttribute('display') && _this.getAttribute('display') == '1') {
                    AH.setCss(_this.querySelector('.weblink'), { 'display': 'block', 'max-width': '' });
                }
                player_id++;
                break;
            case 'wguvideo':
                var token = _this.getAttribute('token') || '',
                    loid = _this.getAttribute('loid') || 0,
                    wid = _this.getAttribute('wid') || '';
                tag_url = 'https://fod.infobase.com/OnDemandEmbed.aspx?token=' + token + '&amp;wID=' + wid + '&amp;plt=FOD&amp;loid=' + loid;
                var tag_prefix = '<iframe tabindex="' + tabindex.z + '" title="' + player_title + '" allowfullscreen="" frameborder="0" height="410" src="https://wgu.idm.oclc.org/login?' + 'url=',
                    tag_postfix = '&amp;w=640&amp;h=360&amp;fWidth=660&amp;fHeight=410&#10;ref=http://wgu.libguides.com.wgu.idm.oclc.org/c.php?g=57662&amp;p=1384747" style="border:1px solid #ddd;" width="660">&amp;amp;nbsp;</iframe>',
                    frame = tag_prefix + tag_url + tag_postfix;
                var tag_href = 'https://wgu.idm.oclc.org/login?&url=' + tag_url + '&amp;w=640&amp;h=360&amp;fWidth=660&amp;fHeight=410';
                var msg = '<div class="alert alert-info clearfix"><b>Error in displaying video?</b> Please click on SHOW VIDEO button to open the video in new tab.';
                msg += '<a class="btn btn-primary float-right" href="' + tag_href + '" target="_blank">Show Video</a></div>';
                AH.insert(_this, msg + frame, 'beforeend');
                player_id++;
                break;
            case 'object3d':
                if (_this.hasAttribute('guids')) {
                    asset = _this.getAttribute('guids');
                }
                var asset_arr = (asset.indexOf(',') !== -1) ? asset.split(',') : asset;
                tag_html = '';
                if (Array.isArray(asset_arr)) {
                    iframe_src = baseUrl + 'utils/3d_objects/?func=load_in_frame&cguds=' + asset;
                    tag_html = '<iframe tabindex=\'' + tabindex.z + '\' title=\'' + player_title + ' \'class=\'quiz_player 3d_player\'  name=\'3d' + player_id + '\' id=\'3d' + player_id + '\' src=\'' + iframe_src + '\'  onLoad=\'window.parent.autoResize(this.id)\'></iframe>';
                } else if (_this.hasAttribute('inline')) {
                    tag_html = '<span class="open-3d-object inline-3d-object-link">' + title + '</span>';
                } else {
                    tag_html = '<div class="alert alert-info clearfix p-md">' + title + '<a tabindex="' + tabindex.z + '" class="btn btn-primary float-right open-3d-object" title="' + title + '">3D View</a></div>';
                }
                AH.insert(_this, tag_html, 'beforeend');
                player_id++;
                break;
            case 'math features':
                var subtypeContainer = [],
                    proctor_tool = [],
                    ruler_tool = [],
                    image_tool = [],
                    direction_tool = [];

                proctor_tool['btn_value'] = 'Protractor';
                proctor_tool['link'] = 'protractor.png';
                proctor_tool['style'] = 'width:385px;height:200px;';
                proctor_tool['class'] = 'icomoon-learn-sm';
                proctor_tool['img_class'] = 'maths_protractor';
                proctor_tool['close_style'] = 'top:96px;';

                ruler_tool['btn_value'] = 'Ruler';
                ruler_tool['link'] = 'ruler.png';
                ruler_tool['style'] = 'width:500px;height:auto;';
                ruler_tool['class'] = 'icomoon-sort';
                ruler_tool['img_class'] = 'maths_ruler';
                ruler_tool['close_style'] = 'top:40px;';

                image_tool['btn_value'] = 'Image Tool';
                image_tool['link'] = 'image_tool.png';
                image_tool['style'] = 'width:300px;height:300px;';
                image_tool['class'] = 'icomoon-table-2';
                image_tool['img_class'] = 'maths_imagetool';
                image_tool['close_style'] = 'top:144px;';

                direction_tool['btn_value'] = 'Direction Tool';
                direction_tool['link'] = 'direction.png';
                direction_tool['style'] = 'width:auto;height:auto;';
                direction_tool['class'] = 'icomoon-compass';
                direction_tool['img_class'] = 'maths_direction';
                direction_tool['close_style'] = 'top:197px;';

                subtypeContainer['Protactor Tool'] = proctor_tool;
                subtypeContainer['Ruler Tool'] = ruler_tool;
                subtypeContainer['Image Tool'] = image_tool;
                subtypeContainer['Direction Tool'] = direction_tool;

                var math_tools = '<button class = "btn btn-primary m-t-n-xs pull-right math_btn"><span class="m-xs mr-1 align-middle ml0 v-align-ih ' + subtypeContainer[sub_type]['class'] + '"></span>' + subtypeContainer[sub_type]['btn_value'] + '</button>' +
                    '<div class="math_clickable absolute"><div id="math_draggable" class="math_draggable" style="cursor:move;z-index:1050"><div id="math_target" class="math_target">' +
                    '<span class="icomoon-close relative closing_btn pointer"style =' + subtypeContainer[sub_type]['close_style'] + ' data-bs-toggle="tooltip" title="Click to close!"></span>' +
                    '<img id="img_drag" data-bs-toggle="tooltip" title="Drag to measure!" class=' + subtypeContainer[sub_type]['img_class'] + ' style="max-width:none;' + subtypeContainer[sub_type]['style'] + '" src="' + themeUrl + 'foundation/css/images/' + subtypeContainer[sub_type]['link'] + '"></img>' +
                    '</div></div></div>';
                AH.insert(_this, math_tools, 'beforeend');
                if (typeof (rotatable) == 'undefined') {
                    AH.getJSON(baseThemeUrl + 'ux/js/jquery.ui.rotatable.js').then(function () {
                        //JS('#math_target').rotatable();
                    });
                    setTimeout(function () {
                        AH.select('.ui-rotatable-handle').getAttribute('data-bs-toggle', 'tooltip');
                        AH.select('.ui-rotatable-handle').getAttribute('title', 'Rotate the Tool!');
                    }, 5000);
                } else {
                    //JS('#math_target').rotatable();
                }
                //JS('#math_draggable').draggable();
                AH.toggleDom('.math_clickable', 'hide');
                AH.bind('.math_btn', 'click', function () {
                    AH.toggleDom('.math_clickable', 'show');
                });
                AH.bind('.closing_btn', 'click', function () {
                    AH.toggleDom('.math_clickable', 'hide');
                });
                player_id++;
                break;
            case 'stepplayer':
                intervals = getPlayerAttrVal(_this, 'intervals'), stepcaptions = '';
                if (_this.hasAttribute('stepcaptions')) {
                    stepcaptions = _this.getAttribute('stepcaptions');
                }
                stepplayer(_this, asset, title, intervals, stepcaptions);
                player_id++;
                break;
            case 'toggleoutput':
                var _div = '<button class="toggleoutputbtn btn btn-sm btn-outline-secondary" style="padding: 1px 10px;margin-bottom: 2px;" data-player="' + player_id + '" data-show="' + show_caption + '" data-hide="' + hide_caption + '" tabindex="0" onclick=showToggleOutput(_this)>' + show_caption + '</button><div class="toggleoutputimg my-3 text-center h" data-player="' + player_id + '"><img ' + (border_check ? 'class="img-bordered"' : '') + ' src="' + image_url + '" alt="' + alt + '" /></div>';
                _this.innerHTML = _div;
                player_id++;
                break;
            case 'lablink':
                _this.classList.add('w-100');
                if (_this.hasAttribute('labguid')) {
                    asset = _this.getAttribute('labguid');
                }
                if (_this.hasAttribute('label')) {
                    title = _this.getAttribute('label');
                }
                var lab_url = baseUrl + '?func=start_test&test_type=-13&inline_guid=' + asset;
                var isplayer = getPlayerAttrVal(_this, 'isplayer');
                if (isplayer == 1) {
                    lab_url = baseUrl + 'quiz_player.php?func=full_mode&content_guid=' + asset + '&is_frame=1';
                }
                var lab_html = '<div class="alert alert-info clearfix p-md">' + title + '<a tabindex="' + tabindex.z + '" class="btn btn-primary float-right" href= "' + lab_url + '" target="_blank">Open</a></div>';
                AH.insert(_this, lab_html, 'afterbegin');
                player_id++;
                break;
            case 'integrate':
                alt = 'Preview of the video';
                if (_this.hasAttribute('title')) {
                    if (_this.getAttribute('title') != '') {
                        alt = 'Preview of the ' + _this.getAttribute('title') + ' video';
                    }
                }
                AH.insert(_this, '<center><div tabindex="' + tabindex.z + '" class="integrate" style="position:relative;display:inline-block;min-width:500px;max-width:800px;cursor:pointer" asset="' + asset + '" title="' + title + '"><img class="noImgModal" alt="' + alt + '" title="Click to play video" src="' + DOWNLOAD_IMAGE_URL + preview_image + '"/><span class="play-video-icon" style="position:absolute;z-index:10;left:50%;top:50%;margin-top:-30px;margin-left:-30px;"></span></div></center>', 'beforeend');

                if (_this.hasAttribute('display')) {
                    AH.selectAll(_this.querySelectorAll('.integrate'), 'addClass', _this.getAttribute('display'));
                }
                if (_this.hasAttribute('border')) {
                    if (_this.getAttribute('border') == '1') _this.querySelector('.integrate').style.border = '1px solid #000';
                }

                player_id++;
                break;
            case 'geometry':
                var alignValue = AH.select('player').getAttribute('align');
                var labelValue = AH.select('player').getAttribute('label');
                var showAngle = AH.select('player').getAttribute('display');

                var angleValue = [],
                    colorValue, heightValue, widthValue, classStyle, distance;
                var x1, y1, x2, y2;
                if (labelValue) {
                    labelValue = labelValue.trim().split(',');
                }

                if (AH.select('player').getAttribute('color') != '') {
                    colorValue = AH.select('player').getAttribute('color');
                } else {
                    colorValue = 'red';
                }
                if (alignValue == 'Center Align') {
                    classStyle = 'float-none';
                } else if (alignValue == 'Right Align') {
                    classStyle = 'float-right';
                } else {
                    classStyle = 'float-left';
                }

                if (AH.select('player').getAttribute('subtype') == 'Triangles') {
                    angleValue = AH.select('player').getAttribute('triangle');
                    if (angleValue) {
                        angleValue = angleValue.trim().split(',');
                    } else {
                        console.log('no angle');
                    }

                    x1 = 250, y1 = 350, c1 = 400, c2 = 350;
                    heightValue = '400px';
                    widthValue = '600px';

                    var A, B, C, a = c1 - x1,
                        c, b;

                    C = angleValue[0];
                    B = angleValue[1];
                    angleValue[2] = 'x';
                    var answer = solveTriangle(A, B, C, a, b, c);
                    var solution = answer.slice(0, 6);

                    x2 = xcoordinate(solution[4], C) + x1;
                    y2 = y1 - ycoordinate(solution[4], C);

                    distance = 'M ' + c1 + ',' + c2 + ' L ' + x1 + ',' + y1 + ' L ' + x2 + ',' + y2 + 'Z';

                } else {
                    var sizeValue = AH.select('player').getAttribute('size');

                    if (AH.select('player').getAttribute('angle') != '') {
                        angleValue[0] = AH.select('player').getAttribute('angle');
                    } else {
                        angleValue[0] = 60;
                    }

                    angleValue[1] = '';
                    angleValue[2] = '';

                    if (sizeValue == 'Large') {
                        x1 = 300, y1 = 250, c1 = 600, c2 = 250;
                        heightValue = '510px';
                        widthValue = '610px';
                    } else if (sizeValue == 'Medium') {
                        x1 = 250, y1 = 250, c1 = 500, c2 = 250;
                        heightValue = '410px';
                        widthValue = '510px';
                    } else {
                        x1 = 250, y1 = 150, c1 = 400, c2 = 150;
                        heightValue = '310px';
                        widthValue = '410px';
                    }

                    x2 = xcoordinate(c1 - x1, angleValue[0]) + x1;
                    y2 = y1 - ycoordinate(c1 - x1, angleValue[0]);

                    distance = 'M ' + c1 + ',' + c2 + ' L ' + x1 + ',' + y1 + ' L ' + x2 + ',' + y2;
                }

                _this.innerHTML = '<svg id="angles" height=' + heightValue + ' width=' + widthValue + ' class="mx-auto d-block ' + classStyle + '"></svg>';

                var path, fill = 'none',
                    stroke = 'red',
                    strokeWidth = '3',
                    x, y,
                    svg = document.getElementById('angles'),
                    ns = 'http://www.w3.org/2000/svg';

                path = document.createElementNS(ns, 'path');
                path.setAttribute('d', distance);
                path.setAttribute('fill', fill);
                path.setAttribute('stroke', colorValue);
                path.setAttribute('stroke-width', strokeWidth);
                svg.appendChild(path);

                var textContentValue = [{
                    'x': x1,
                    'y': y1,
                    'x_inside': x1 + 7,
                    'y_inside': y1 - 3,
                    'text': labelValue[2],
                    'angle': angleValue[0],
                    'id': 'first'
                },
                {
                    'x': c1,
                    'y': c2,
                    'x_inside': c1 - 27,
                    'y_inside': c2 - 5,
                    'text': labelValue[1],
                    'angle': angleValue[1],
                    'id': 'second'
                },
                {
                    'x': x2,
                    'y': y2,
                    'x_inside': x2 + 2,
                    'y_inside': y2 + 20,
                    'text': labelValue[0],
                    'angle': angleValue[2],
                    'id': 'third'
                }
                ];

                var valueChange = 15;
                for (var geo_i = 0; geo_i < textContentValue.length; geo_i++) {
                    var svg_ref = document.createElementNS(ns, 'text');
                    var text_ref = document.createElementNS(ns, 'text');
                    var circle_ref = document.createElementNS(ns, 'circle');
                    circle_ref.setAttribute('cx', textContentValue[geo_i]['x']);
                    circle_ref.setAttribute('cy', textContentValue[geo_i]['y']);
                    circle_ref.setAttribute('stroke', 'black');
                    circle_ref.setAttribute('stroke-width', 4);
                    circle_ref.setAttribute('r', 2);
                    svg_ref.setAttribute('x', textContentValue[geo_i]['x'] - valueChange);
                    svg_ref.setAttribute('y', textContentValue[geo_i]['y'] + valueChange);
                    svg_ref.textContent = textContentValue[geo_i]['text'];
                    svg.appendChild(svg_ref);
                    svg.appendChild(circle_ref);
                    if (showAngle == 'check') {
                        text_ref.setAttribute('x', textContentValue[geo_i]['x_inside']);
                        text_ref.setAttribute('y', textContentValue[geo_i]['y_inside']);
                        text_ref.setAttribute('id', textContentValue[geo_i]['id']);
                        text_ref.textContent = textContentValue[geo_i]['angle'];
                        svg.appendChild(text_ref);
                    }
                }

                if (showAngle == 'check') {
                    if (AH.select('player').getAttribute('subtype') == 'Triangles') {
                        console.log('triangle');
                        document.getElementById('second').appendChild(document.createTextNode(String.fromCharCode(176)));
                        document.getElementById('third').appendChild(document.createTextNode(String.fromCharCode(176)));
                    }
                    document.getElementById('first').appendChild(document.createTextNode(String.fromCharCode(176)));
                }
                player_id++;
                break;
            case 'braingames':
                var game = _this.getAttribute('game');
                if (game) {
                    iframe_src = baseUrl + 'utils/brain_games/' + game + '/index.php';
                    tag_html = '<iframe tabindex=\'' + tabindex.z + '\' title=\'' + player_title + ' \'class=\'quiz_player brain_games\'  name=\'brain_game' + player_id + '\' id=\'brain_game' + player_id + '\' src=\'' + iframe_src + '\'  onLoad=\'window.parent.autoResize(this.id)\'></iframe>';
                }
                AH.insert(_this, tag_html, 'beforeend');
                player_id++;
                break;
            case 'plugin':
                tag_div = '<div class="alert alert-info clearfix p-md" plugin-cmp-id="' + player_id + '" player-asset="' + asset + '"><span style="line-height:34px;">' + title;
                tag_div += '</span><a tabindex=\'' + tabindex.z + '\' class=\'btn btn-primary float-right open-plugin-component\'>Open</a></div>';
                if (AH.selectAll('[plugin-cmp-id="' + player_id + '"]').length == 0) {
                    AH.insert(_this, tag_div, 'beforeend');
                }
                player_id++;
                break;
            case 'lms':
                tag_url = '';
                attrs = _this.attrAsObj();
                tag_url = AH.param2Url(attrs);
                tag_url = baseUrl + 'utils/temp/lms1.php?' + tag_url;
                var ovelay_class = '';
                if (typeof attrs['overlay'] != 'undefined') {
                    ovelay_class = 'overlay_external_link overlay';
                }
                tag_div = '<div class="alert alert-info clearfix p-md" lms-cmp-id="' + player_id + '">' + title;
                tag_div += '<a tabindex=\'' + tabindex.z + '\' target=\'_blank\' href=\'' + tag_url + '\' asset=\'' + tag_url + '\' class=\'edited btn btn-primary float-right open-lms-link  ' + ovelay_class + '\'>Open</a></div>';
                _this.innerHTML = tag_div;
                player_id++;
                break;
            case 'card':
                tag_div = '<div class="alert alert-info d-flex justify-content-between align-items-center" player-asset="' + asset + '">' + title;
                var link_text = _this.hasAttribute('caption') ? _this.getAttribute('caption') : 'Open';
                attrs = _this.attrAsObj();
                if (_this.hasAttribute('ctitle') && _this.getAttribute('ctitle') != '') {
                    attrs['ctitle'] = _this.getAttribute('ctitle');
                }
                var cardTypes = { 1: 3, 2: 3, 3: 2, 4: 3, 5: 2, }; // This is to map appropriate flashcard.
                /*attrs['is_player'] = 1;
                attrs['is_overlay'] = 1;*/
                attrs['title'] = 'Cards';
                attrs['func'] = 'get_flash_card';
                attrs['flashcard_type'] = _this.hasAttribute('card_type') ? cardTypes[_this.getAttribute('card_type')] : 3;
                attrs['is_frame'] = '';
                attrs['item_sequence'] = 1;

                card_url = AH.param2Url(attrs);
                card_url = baseUrl + 'index.php?' + card_url;
                card_url = 'open_test(\'' + card_url + '\')';
                card_url = 'onclick="' + card_url + '"';
                tag_div += '<a tabindex=\'' + tabindex.z + '\' ' + card_url + ' class=\'btn btn-primary card_player\'>' + link_text + '</a></div>';
                AH.insert(_this, tag_div, 'beforeend');
                player_id++;
                break;
            case 'live_lab':
                AH.insert(_this, '<a tabindex="' + tabindex.z + '" class="btn btn-primary startlab" href="' + baseUrl + 'quiz_player.php?func=full_mode&player_id=' + player_id + '&content_guid=' + guids + '&group_guid=' + group_guids + '&virtual_lab=1&is_player=1" target="_blank">' + title + '</a>', 'beforebegin');
                player_id++;
                break;
            case 'test':
                ITEMPLAYER.test(_this, content_guid, player_id, asset, embed, no_of_attempts);
                player_id++;
                break;
            default:
                _this.classList.add('w-100');
                iframe_src = baseUrl + 'quiz_player.php?player_id=' + content_guid + '_' + player_id + '&group_guid=' + asset + '&title=' + title + '&player_setting' + options;
                AH.insert(_this, '<iframe tabindex=\'' + tabindex.z + '\' class=\'quiz_player\' name=' + content_guid + '_' + player_id + ' id=' + content_guid + '_' + player_id + ' src=\'' + iframe_src + '\' style=\'' + options + '\' onLoad=\'window.parent.autoResize(this.id)\' title=\'' + player_title + '\'></iframe>', 'beforeend');
                player_id++;
                break;
        }
    });
    setTimeout(() => {
        AH.listen(document, 'click', '.exhibitAction', (v) => {
            exhibitAction(v.attributes?.action?.value, v.attributes?.player_id?.value, v)
        })
    }, 1000);
}
function exhibitAction(action, player_id, v){
    AH.activate(1);
    const aEle = document.querySelector(`[player_id='${player_id}']`);

    const show_caption = aEle.attributes['data-show']?.value;
    const hide_caption = aEle.attributes['data-hide']['value']
        ? aEle.attributes['data-hide'].value
        : show_caption;

    if (action == 'scenarioAction') {
        if(AH.selectAll(`modal-player${player_id}`)?.length == 0){
            
            const m1 = makeModal (`modal-player${player_id}`, '', v?.nextElementSibling?.innerHTML || '', '', 'scaleUp');
            document.body.insertAdjacentHTML('beforeend', m1);
        }
        var myModal = new bootstrap.Modal(document.getElementById(`modal-player${player_id}`), {
            keyboard: false,
            focus: true
        });
        myModal.show();
        aEle.innerText = hide_caption;
    } else if (action == 'showToggleOutput') {
        const ele = v.nextElementSibling;
        if (ele.classList.contains('h')) {
            ele.classList.remove('h');
            aEle.innerText = hide_caption;
        } else {
            ele.classList.add('h');
            aEle.innerText = show_caption;
        }
        ele.querySelector('.close')?.addEventListener('click', (e) => {
            e.stopPropagation();
            ele.classList.add('h');
            aEle.innerText = show_caption;
        })
    }
    AH.activate(0);
};

function getTestFrameworkDetail(checkViewAttr) {
    var detail = -1;
    if (AH.select('#uc-item-test-template').length === 1) {
        var tempTestView = AH.select('#uc-item-test-template').getAttribute('temp_test_view');
        if (!checkViewAttr && tempTestView && tempTestView != '') {
            return tempTestView;
        }
        return AH.select('#uc-item-test-template').nodeName && AH.select('#uc-item-test-template').getAttribute('view');
    }
    return detail;
}

function initAccordion() {
    if (AI.selectAll('.drop_list section[nd="1"]').length < 1) {
        return true;
    }
    AH.selectAll('.drop_list section[nd="1"] article', 'hide');
    let init = AH.select('.drop_list_a > section[nd="1"]:first-child');
    AH.selectAll(init, 'addClass', "accordion-active");
    init.nodeType && AH.find(init, 'article', { action: 'show' });

    AH.selectAll('.drop_list_a section[nd="1"]', 'removeClass', "active");
    AH.listenAll('.drop_list_a section[nd="1"]', 'click', (event) => {
        let _this = AH.parent(event.target, 'section[nd="1"]');
        let sib = AH.siblings(_this, 'section[nd="1"]');
        // window.tt = _this;
        // console.log(_this, sib);
        AH.selectAll(sib, 'removeClass', 'accordion-active')
        sib.forEach((_elm) => { AH.find(_elm, 'article', { action: 'hide' }) });
        AH.select(_this, 'addClass', 'accordion-active');
        AH.find(_this, 'article', { action: 'show' })
    });
    AH.selectAll('.drop_list_b section[nd="1"]', 'removeClass', ["accordion-active", "active"]);

    AH.listenAll('.drop_list_b section[nd="1"]', 'click', (event) => {
        let self = event.target, parent = event.target.closest('section[nd="1"]');
        if (event.target.localName == 'header')
            AH.find(parent, 'article', { action: 'toggleDisplay' });
        // self.toggleClass('active');
    });
}

export function prettifyContent(config) {
    
    let funclist = Object.keys(contentUpdateFuncs);
    let func_len = funclist.length;
    for (let i = 0; i < func_len; i++) {
        let func = funclist[i];
        config[func] = config[func] || 0;
        if (config[func] == 1) {
            if (typeof contentUpdateFuncs[func] === 'function') {
                contentUpdateFuncs[func](config);
            }
        }
    }
    // disable find
    // if (jQuery && typeof jQuery.fn.disableFind == 'function') {
    //     if (AH.selectAll('[uc_item_content_subtype="8"]').length == 0) {
    //         if (typeof config.protect_find == 'undefined') {
    //             AH.selectAll('.uc_protect_find').disableFind();
    //         }
    //     }
    // }
}
const contentUpdateFuncs = {
    pre: function (config) {
        if (AH.selectAll('.prettyprint .linenums li').length <= 0 && typeof prettyPrint == 'function') {
            prettyPrint();
        }
    },

    // player: function (config) {
    //     if (typeof config.player_id != 'undefined') {
    //         tag_player(config.player_id);
    //     } else {
    //         tag_player();
    //     }
    // },

    math: function (config) {
        console.log("is_math_required", config.is_math_required);
        mathMLRender(config.math_id, config.is_math_required);
    },

    caption: function (config) {
        AH.selectAll('img[imgtext]').forEach(function (currentImg) {
            const imgTextshow = currentImg.attr('imgtext');
            AH.nextElm(currentImg, 'uc\\:caption').remove();
            AH.insert(currentImg, '<uc:caption>' + imgTextshow + '</uc:caption>', 'afterend');
        });
        if (typeof setUcCaptionWidth == 'function') {
            var _delay = config.caption_delay || 3000;
            setUcCaptionWidth(_delay);
        }
    },

    list: function (config) {
        AH.selectAll('.list4[start],.list2[start]').forEach(function (_this) {
            var num = parseInt(_this.getAttribute('start')) - 1;
            AH.setCss(_this, { 'counter-increment': 'li ' + num });
        });
    },

    table: function (config) {
        AH.selectAll('table[table_caption]').ForEach(function (currenttab) {
            let _next = currenttab.nextElementSibling;
            if (!_next.classList.contains('table_capt_center')) {
                let tabTextshow = currenttab.getAttribute('table_caption');
                AH.insert(currenttab, '<div class=\'table_capt_center\'>' + tabTextshow + '</div>', 'afterend');
            }
        });
    },
    imgAltText: function (config) {
        //(config.ajax) ? imageSpeech.getAltTextAjax(config.container): imageSpeech.getAltText(config.container);
    },
    link: function (config) {
        AH.select('.link').setAttribute('tabindex', tabindex.z);
        AH.addClass('.link[layout="button"]', 'btn btn-default nohover');
    },
    ucHint: function (config) {
        if (!AH.selectAll('.uc_answer_hint').length && !AH.selectAll('.uc_step_explanation').length) {
            return false;
        }
        AH.select('.edit_chapter').removeAttribute('tabindex');
        AH.selectAll('.uc_answer_hint, .uc_step_explanation').forEach(function (el, i) {
            var exp_steps = el.classList.contains('uc_step_explanation');

            if (exp_steps) {
                AH.find(el, '.uc_step', 'all').forEach(function (elm, j) {
                    if (elm.innerHTML.trim().match(/^<br/g) == null) {
                        AH.insert(elm, '<br/>', 'beforebegin');
                    }
                });
                var btnCaption = (el.getAttribute('data-btnnme') != undefined && el.getAttribute('data-btnnme') != '') ? el.getAttribute('data-btnnme') : 'Next';
                if (AH.find(el, '.exp_next_btn', 'all').length > 0) {
                    AH.find(el, '.exp_next_btn').remove();
                }
                AH.find(el, '.addnext_caption').remove();
                AH.insert(el, '<button type="button" onclick="showUcExpStep(this)" class="exp_next_btn btn btn-sm btn-outline-primary bg-white imgcenter mx-auto text-primary" style="width: 15%; font-size: 15px; margin-top: 15px;">' + btnCaption + '</button>', 'aftertend');
            } else {
                // for hint
                var head_caption = 'Hint';
                var step_caption = 'hint';
                if (el.hasAttribute('head_caption')) {
                    head_caption = el.getAttribute('head_caption');
                }
                if (el.hasAttribute('step_caption')) {
                    step_caption = el.getAttribute('step_caption');
                }
                var msg = '<b>' + head_caption + ': </b> <span class=\'li_count\'>' + AH.find(el, 'li', 'all').length + '</span> ' + step_caption + '(s) are available.';
                var _btn = '<button type="button" style="margin-top:-4px" onclick="showHints(this)" class="hint_show btn btn-primary float-right">Show</button>';
                var _btn_hide = '<button type="button" style="margin-top:-4px" onclick="hideHints(this)" class="ml-md hint_hide btn btn-primary hidden float-right">Hide</button>';
                var pre_block = '<section id=\'uc_hint_' + i + '\' class=\'mt uc_hint_section white-bg alert text_lightBlack m-b-md alert-info\'>' + _btn_hide + _btn + msg + '</section>';
                el.innerHTML = pre_block + el.innerHTML;
                el.classList.add('list2');
            }
        });
        window.showHints = function (t) {
            var that = t.closest('.uc_answer_hint');
            AH.toggleDom(AH.find(that, 'li', 'hidden')[0], 'show');
            let len = AH.find(that, 'li', 'hidden').length;
            if (typeof QUIZPLAYERID != 'undefined') {
                window.parent.autoResize(QUIZPLAYERID);
            }
            if (len === 0) {
                len = 'No';
                AH.find(that, '.hint_show').setAttribute('disabled', true);
                AH.find(that, '.hint_hide').prop('disabled', false);
                AH.find(that, '.hint_hide').classList.remove('hidden');
            }
            AH.find(that, '.li_count').innerHTML = len;
        };
        window.hideHints = function (t) {
            var that = t.closest('.uc_answer_hint');
            AH.toggleDom(AH.find(that, 'li', 'visible').pop(), 'hide');
            var len = AH.find(that, 'li', 'visible').length;
            var total_len = AH.find(that, 'li', 'all').length;
            if (typeof QUIZPLAYERID != 'undefined') {
                window.parent.autoResize(QUIZPLAYERID);
            }
            if (len == 0) {
                len = total_len;
                AH.find(that, '.hint_hide').disabled = true;
                AH.find(that, '.hint_show').disabled = false;
            } else {
                AH.find(that, '.hint_hide').disabled = false;
                AH.find(that, '.hint_show').disabled = true;
            }
            AH.find(that, '.li_count').innerHTML = len;
        };
        window.showUcExpStep = function (t) {
            var that = t.closest('.uc_step_explanation');
            AH.toggleDom(AH.find(that, '.uc_step', 'hidden')[0], 'show');
            var len = AH.find(that, '.uc_step', 'hidden').length;
            if (len === 0) {
                AH.toggleDom(t, 'hide');
                if (typeof QUIZPLAYERID != 'undefined') {
                    t.remove();
                    AH.setCss('#' + QUIZPLAYERID, { height: AH.select('#' + QUIZPLAYERID).clientHeight - 100 });
                }
            }

            if (typeof QUIZPLAYERID != 'undefined') {
                setTimeout(function () { window.parent.autoResize(QUIZPLAYERID); }, 200);
            }
            if (typeof setUcCaptionWidth != 'undefined') {
                setUcCaptionWidth();
            }
        };
    },
    tableWrap: function (config) {
        AH.wrap('table', '<div class=\'overflow\'></div>');
    }
};
function getPlayerAttrVal(self, item) {
    let option_attr = '', style_attr = '', data = '';
    if (self.hasAttribute(item)) {
        data = self.getAttribute(item);
    } else {
        if (self.hasAttribute('option') && self.getAttribute('option').trim() != '') {
            option_attr = AH.parseJSON(self.getAttribute('option'));
        }
        if (self.hasAttribute('styles') && self.getAttribute('styles').trim() != '') {
            style_attr = AH.parseJSON(self.getAttribute('styles'));
        }
        if (option_attr[item] != undefined) {
            data = option_attr[item];
        } else if (style_attr[item] != undefined) {
            let item_val = style_attr[item];
            data = (!isNaN(item_val) && item_val.indexOf('px') == -1 && item_val.indexOf('%') == -1) ? item_val + 'px' : item_val;
        }
    }

    return data;
}
function createPlayerEmbed(embed, player_title, src, attributes, button_name) {
    var embed_html = '';
    src = src || false;
    player_title = player_title || false;
    button_name = button_name || false;
    if (embed == 'inline') {
        embed_html = '<iframe tabindex="' + tabindex.z + '" title="' + player_title + '" src="' + src + '" onload="autoResize(this.id)" allowfullscreen ' + attributes + '></iframe>';
    } else if (embed == 'overlay') {
        embed_html = '<button tabindex="' + tabindex.z + '" type="button" ' + attributes + '>' + button_name + '</button>';
    } else if (embed == 'new_tab') {
        embed_html = '<a tabindex="' + tabindex.z + '" href="' + src + '" target="_blank" ' + attributes + '>' + button_name + '</a>';
    }

    return embed_html;
}
function replaceLTGT(str) {
    if (str == '') {
        return str;
    }
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    return str;
}
function removeNanoSpell(){
	const eleList = AH.selectAll('.nanospell-typo, [data-mce-bogus="1"]');
	if(eleList.length>0){
		eleList.forEach(ele => {
			ele.outerHTML = ele.textContent;
		});
	}
};

export function mathMLRender(id_mathML, is_required) {
    console.log("Math rendering..");
    removeNanoSpell();
    if (!is_required) {
        return false;
    }
    let id = id_mathML || false;
    let el = document.body;
    if (id) {
        el = document.getElementById(id);
    }
    if (typeof renderMathInElement == 'function') {
        try {
            renderMathInElement(el, DEFAULTMATHOPTIONS);
        } catch (e) {
            console.warn(e);
        }
    } else {
        let css = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.0-beta/dist/katex.min.css" integrity="sha384-9tPv11A+glH/on/wEu99NVwDPwkMQESOocs/ZGXPoIiLE8MU/qkqUcZ3zzL+6DuH" crossorigin="anonymous">';
        AH.insert(document.body, css, 'beforeend');
        AH.ajax({
            type: 'GET',
            url: itemUrl + '/src/libs/katex.min.js',//window.baseUrlTheme + 'src/libs/katex.min.js',
            async: false,
            dataType: 'script',
        }).then(function (script) {
            AH.addScript(script);
            try {
                renderMathInElement(el, DEFAULTMATHOPTIONS);
            } catch (e) {
                console.warn(e);
            }
        });
    }
}

export function ajaxContentUpdate(config) {
    let funclist = Object.keys(contentUpdateFuncs);
    let func_len = funclist.length;
    for (let i = 0; i < func_len; i++) {
        let func = funclist[i];
        config[func] = config[func] || 0;
        if (config[func] == 1) {
            if (typeof contentUpdateFuncs[func] === 'function') {
                contentUpdateFuncs[func](config);
            }
        }
    }
    // disable find
    // if (jQuery && typeof jQuery.fn.disableFind == 'function') {
    //     if (AH.selectAll('[uc_item_content_subtype="8"]').length == 0) {
    //         if (typeof config.protect_find == 'undefined') {
    //             AH.selectAll('.uc_protect_find').disableFind();
    //         }
    //     }
    // }
}

const playerTagConst = {
    setTimeOut: 1000,
    setTimeOutFive: 500,
    effectValue: 1500,
    setTimeOutTwo: 200,
    coordinateX: 250,
    straightAngle: 180,
    straightAngleDouble: 180.0,
    frameWidth: 100,
    arrayValue: 2,
    loaderOffset: 3,
    substrValue: 4,
    playerAttrAsset: 7,
    playerAttrAssetValue: 8,
    cmpAssetLength: 5,
    matchIndex: 7,
    playerAttrCmp: 11,
    compaireKeyCode: 13,
    cmpscrollheight: 115,
    scrollheighttrue: 50,
    scrollheightfalse: 95,
    y1Value: 350,
    c1Value: 400,
    c2Value: 350,
    sliceValue: 6,
    x1Value: 300,
    c1cmpValue: 600,
    y1Axis: 150,
    xinside: 27,
    yinside: 20,
    charcode: 176,
    lleftValue: 40,
    zifalse: 1060,
    windowheight: 0.3,
    cssWidth: 10
};
function stepplayergenerate(mod, stepcaptions, intervals) {
    if (document.getElementById('stepplayer' + mod) != null) {
        var video = document.getElementById('vid' + mod);
        function checkLoad() {
            if (video.readyState === playerTagConst.substrValue) {
                var duration = Math.floor(video.duration);
                var imagecounter = '';
                var intervalArray, i, perTime;
                if (intervals != undefined && intervals != '') {
                    var intervalArrayOld = intervals.split(',');
                    intervalArray = [];
                    intervalArrayOld.forEach((num) => {
                        if (intervalArray.indexOf(num) == -1) {
                            intervalArray.push(num);
                        }
                    });
                } else {
                    var limit = 4;
                    intervalArray = [];
                    for (i = 1; i <= limit; i++) {
                        perTime = Math.floor((duration / limit) * (parseInt(i) - 1));
                        intervalArray.push(perTime);
                    }
                }
                var stepcaptions_array = [];
                if (stepcaptions != undefined && stepcaptions != '') {
                    stepcaptions_array = stepcaptions.split('###');
                }
                for (i = 0; i < intervalArray.length; i++) {
                    perTime = intervalArray[i];
                    var scaption =
                        stepcaptions_array[i] != undefined ? stepcaptions_array[i] : '';
                    imagecounter =
                        imagecounter +
                        '<button type="button" data-caption="' +
                        scaption +
                        '" title="' +
                        scaption +
                        '" class="btn btn-outline-secondary interval_btn imgnums imgbtn_' +
                        i +
                        (i > playerTagConst.arrayValue ? ' h' : '') +
                        '" data-time=' +
                        perTime +
                        ' data-rel=' +
                        i +
                        ' >' +
                        (parseInt(i) + 1) +
                        '</button>';
                }

                imagecounter =
                    '<div class="btn-group col-lg-12 col-md-12 col-sm-12 m-0 p-0"><div class="btn-group" id="pageScroll" style="overflow:hidden;"><button type="button" class="btn btn-outline-secondary imgnums prevbtn navtools" title="Previous Frame" rel="tooltip" disabled="disabled">&#171;</button>' +
                    imagecounter +
                    '<button type="button" class="btn btn-outline-secondary imgnums nextbtn navtools"  title="Next Frame" rel="tooltip">&#187;</button></div></div>';

                document.querySelector('#stepplayer' + mod + ' .imagecounter').innerHTML = imagecounter;
                document.querySelectorAll(`#stepplayer${mod} .interval_btn`).forEach((ele) => {
                    ele.addEventListener('click', (self) => {
                        moveToInterval(mod, self.currentTarget.getAttribute('data-time'));
                    });
                });
                document.querySelector('.prevbtn').addEventListener('click', () => playerNavigation(mod, 0));
                document.querySelector('.nextbtn').addEventListener('click', () => playerNavigation(mod, 1));
                playerCheck(document.querySelector('#stepplayer' + mod + ' .imagecounter'));
                video.addEventListener(
                    'timeupdate',
                    function () {
                        var currentTime = Math.floor(video.currentTime);
                        if (currentTime == 0) {
                            playerReset(mod);
                        }
                        if (document.querySelectorAll('#stepplayer' + mod + ' .imgnums[data-time="' + currentTime + '"]').length > 0) {
                            document.querySelector('#stepplayer' + mod + ' .imgnums').classList.remove('active');
                            document.querySelector('#stepplayer' + mod + ' .imgnums[data-time="' + currentTime +'"]').classList.add('active');
                            if (document.querySelector('#stepplayer' + mod + ' .imgnums[data-time="' + currentTime +'"]').offsetWidth == 0) {
                                playerNavigation(mod, 1);
                            }
                            var caption = document.querySelector('#stepplayer' + mod +' .imgnums[data-time="' + currentTime +'"]').getAttribute('data-caption');
                            if (video.currentTime != 0) {
                                document.querySelector('#stepplayer' + mod + ' .stepcaption').innerHTML = caption;
                            }
                        }
                        if (video.currentTime == video.duration) {
                            changeplaypausebtn(mod, 'play');
                        }
                    },
                    false
                );
            } else {
                setTimeout(checkLoad, playerTagConst.frameWidth);
            }
        }
        checkLoad();
    }
}
function playerNavigation(mod, next) {
    let object = document.querySelector('#stepplayer' + mod + ' .imagecounter #pageScroll');
    let current_visible = object.querySelectorAll('button:not(.navtools)')
    let prevbtn = object.querySelector('.prevbtn');
    let nextbtn = object.querySelector('.nextbtn');
    current_visible.forEach((el) => {
        el.classList.add('h');
    });
    if (next) {
        current_visible.forEach(function(ele) {
            ele.classList.remove('h');
            if (ele.nextSibling.classList.contains('nextbtn')) {
                nextbtn.setAttribute('disabled', 'disabled')
            } else {
                prevbtn.removeAttribute('disabled');
            }
        });
    } else {
        current_visible.forEach(function(ele) {
            ele.classList.remove('h');
            if (ele.previousSibling.classList.contains('prevbtn')) {
                prevbtn.setAttribute('disabled', 'disabled')
            } else {
                nextbtn.removeAttribute('disabled');
            }
        });
    }
}
function moveToInterval(mod, perTime) {
    let video = document.getElementById('vid' + mod);
    video.currentTime = perTime;
    video.play();
    changeplaypausebtn(mod, 'pause');
}
function playerCheck(object) {
    if(object.querySelector('button:not(.navtools)').length <= 3) {
        object.querySelector('.navtools').setAttribute('disabled', 'disabled');
    } else {
        object.querySelector('.nextbtn').removeAttribute('disabled');
    }
}
function playerReset(mod) {
    let object = document.querySelector('#stepplayer' + mod + ' .imagecounter #pageScroll');
    let btns = object.querySelectorAll('button:not(.navtools)');
    btns.forEach((el) => {
        el.classList.add('h');
    });
    for (let index=0; index < 3 ; index++ ) {
        if (btns[index] != undefined) {
            btns[index].classList.remove('h');
        }
    }
    playerCheck(object);
}
function changeplaypausebtn(mod, type) {
    var playicon = 'icomoon-play-5';
    var pauseicon = 'icomoon-pause-22';
    if (type == 'play') {
        document.querySelector('#stepplayer' + mod + ' .playpausebtn').classList.remove(pauseicon);
        document.querySelector('#stepplayer' + mod + ' .playpausebtn').classList.add(playicon);
    } else if (type == 'pause') { //NOSONAR
        document.querySelector('#stepplayer' + mod + ' .playpausebtn').classList.remove(playicon);
        document.querySelector('#stepplayer' + mod + ' .playpausebtn').classList.add(pauseicon);
    }
}
function playpausevideo(mod, type) {
    var video = document.getElementById('vid' + mod);
    if (type == 'play') {
        video.play();
        changeplaypausebtn(mod, 'pause');
    } else if (type == 'reset') { //NOSONAR
        video.pause();
        video.currentTime = 0;
        changeplaypausebtn(mod, 'play');
    }
}
function toggleFullScreen(ele, self, height) {
    let btn = self.currentTarget.children;
    if (fullHeightAllow) {
        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullscreen) {
            ele.webkitRequestFullscreen();
        } else if (ele.msRequestFullscreen) { //NOSONAR
            ele.msRequestFullscreen();
        }
        ele.style.height = '100%';
        btn[1].textContent = 'Revert';
        btn[0].classList.add('icomoon-new-24px-collapse-1');
        btn[0].classList.remove('icomoon-new-24px-expand-1');
        fullHeightAllow = false;
    } else {
        fullHeightAllow = true;
        ele.style.height = height;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { //NOSONAR
            document.msExitFullscreen();
        }
        btn[1].textContent = 'Full Screen';
        btn[0].classList.remove('icomoon-new-24px-collapse-1');
        btn[0].classList.add('icomoon-new-24px-expand-1');
    }
}
function stepplayer(player, asset, title, intervals, stepcaptions, player_id) {
    if (stepcaptions) {
        stepcaptions = stepcaptions.replace(/\\(\W)/gm, '$1');
    }
    let a = document.querySelectorAll('.stepplayerhtml').length;
    let newID = parseInt(a) + 1;

    let settings_html =
        '<div class="dropup settingDropDown float-start"> <span class="text-secondary icomoon-cog m-sm pointer" data-bs-toggle="dropdown" tabindex="0" aria-label="Settings" title="Settings" rel="tooltip"></span> <ul id="settingTabs" class="dropdown-menu font14 p-sm" role="menu"> <ul class="border-bottom margin-n-20 nav nav-pills"> <li class="nav-item ps-0"><a class="nav-link active" data-bs-toggle="tab" href="#ccmenu' +
        newID +
        '"><span class="icomoon-captions-1 s3 font-weight-bold" rel="tooltip" data-original-title="Caption"></span></a></li><li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#playback' +
        newID +
        '"><span class="icomoon-speed-1 s3 font-weight-bold" rel="tooltip" data-original-title="Speed"></span></a></li></ul> <div class="float-start m-t-n tab-content w-100"> <div class="float-start mt-1 tab-pane w-100 active show position-relative" style="bottom:47px;" id="ccmenu' +
        newID +
        '"> <ul class="float-start mt-1 ps-0 w-100" style="list-style-type: none;"> <li><a class="dropdown-item subtitles" data-mod="' +
        newID +
        '" data-value="0" tabindex="0">Off</a></li><li><a class="dropdown-item subtitles bg-l-grey font-weight-bold" data-mod="' +
        newID +
        '" data-value="1" tabindex="0">English</a></li></ul> </div><div class="float-start mt-1 tab-pane w-100 position-relative" style="bottom:47px;" id="playback' +
        newID +
        '"> <ul class="float-start margin-1 overflow-y-scroll ps-0 speedmenu w-100" style="list-style-type: none;max-height:65px;"></ul> </div></div></ul></div><div class="float-start ml-md pointer h-imp"><span class="text-secondary icomoon-expand stepplayer-fs" data-mod="' +
        newID +
        '" rel="tooltip" data-original-title="Full screen"></span></div>';

    let download_html =
        '<div class="card stepplayerhtml mx-auto" id="stepplayer' +
        newID +
        '" style="width:60%;min-height:400px;"><div class="card-header d-inline-flex"><div class="col-9 pt-2">' +
        title +
        '</div><button aria-label="Full Screen" type="button" class="btn btn-sm ml-auto stepplayer_fullscreen' +
        player_id + 
        ' outline2" title="Full Screen / Revert" rel="tooltip"><i class=" full-screen-btn-icon icomoon-new-24px-expand-1 font19 mt-tp mr-1 float-start"></i><small aria-hidden="true" class="toolbar-label font18 line_height1 align-bottom d-none d-lg-inline-block full-screen-btn-label" id="resize' +
        newID +
        '">Full Screen</small></button></div><div class="card-body position-relative"><div class="card-text text-center"> <video id="vid' +
        newID +
        '" style="max-width:100%;" oncontextmenu="return false;"> <source src="' +
        asset +
        '"/>Your browser does not support the video tag. </video><div class="stepcaption font15"></div></div></div><div class="card-footer"><div class="row col-12 m-0 p-0"> <div class="row col-12"><button class="float-start mr-md btn btn-info startbtn h" type="button" data-mod="' +
        newID +
        '" data-html="Start">Start</button></div><div class="stepplayercont row m-0 p-0 col-12"><div class="col-12 col-lg-10 col-md-9 col-sm-12 imagecounter p-0"></div><div class="col-lg-2 col-md-3 col-sm-12 float-end m-0 p-0"> <span class="float-start s4 pointer mt-sm playpausebtn icomoon-play-5 text-secondary" tabindex="0" aria-label="Play/Pause Button"  title="Play/Pause Button" rel="tooltip" style="margin-top: 5px!important;"></span><div class="float-start ml-md" style="margin-top:7px!important;">' +
        settings_html +
        '</div></div></div><div class="clear-both"></div></div></div></div>';

    player.innerHTML = download_html;
    stepplayergenerate(newID, stepcaptions, intervals); // function added

    //ADDING SPEED CODE START
    let speedArray = ['0.5', '1', '1.5', '2'];
    let speedhtml = '';
    for (let i in speedArray) {
        if (speedArray.hasOwnProperty(i)) {
            speedhtml =
                speedhtml +
                '<li><a class="dropdown-item gifspeed ' +
                (i == 1 ? 'bg-l-grey font-weight-bold' : '') +
                '" data-mod="' +
                newID +
                '" data-speed="' +
                speedArray[i] +
                '" tabindex="0">' +
                speedArray[i] +
                'x</a></li>';
            
        }
    }

    //Bootstrsap tab code.
    setTimeout(() => {
        document.querySelector('#stepplayer' + newID + ' .speedmenu').innerHTML = speedhtml;

        let triggerTabList = [].slice.call(document.querySelectorAll('#stepplayer' + newID + ' .nav-pills a.nav-link'))
        triggerTabList.forEach(function (triggerEl) {
            let tabTrigger = new bootstrap.Tab(triggerEl)
            triggerEl.addEventListener('click', function(event) {
                document.querySelector(`#stepplayer${newID} #settingTabs`).classList.toggle('show');
                event.preventDefault()
                tabTrigger.show()
            });
        })
    }, 1000);

    
        //Show setting dropdown.
    AH.listen(document, 'click', `#stepplayer${newID} .settingDropDown`, (_this, self) => {
        _this.querySelector('#settingTabs').classList.toggle('show');
    });

    AH.listen(document, 'keyup', `#stepplayer${newID} .settingDropDown`, (_this, self) => {
        if (self.keyCode == 13) {
            _this.querySelector('#settingTabs').classList.toggle('show');
        }
    });
        
    AH.listen(document, 'click', `#stepplayer${newID}.stepplayerhtml .playpausebtn`, (_this, self) => {
        let mod = _this.closest('.stepplayerhtml').querySelector('.startbtn').getAttribute('data-mod');
        let video = document.getElementById('vid' + mod);
        if (video.paused) {
            video.play();
            changeplaypausebtn(mod, 'pause');
        } else {
            video.pause();
            changeplaypausebtn(mod, 'play');
        }
    })

    AH.listen('document', 'click', `#stepplayer${newID}.stepplayerhtml .startbtn`,(_this, self) => {
        let mod = _this.getAttribute('data-mod');
        if (_this.getAttribute('data-html') == 'Stop') {
            _this.setAttribute('data-html', 'Start');
            _this.innerHTML = 'Start';
            document.querySelector('#stepplayer' + mod + ' .stepplayercont').classList.add('h');
            playpausevideo(mod, 'reset');
            document.querySelector('#stepplayer' + mod + ' .stepcaption').innerHTML = '';
        } else {
            document.querySelector('#stepplayer' + mod + ' .stepplayercont').classList.remove('h');
            _this.setAttribute('data-html', 'Stop');
            _this.innerHTML = 'Stop';
            playpausevideo(mod, 'play');
        }
    });

    AH.listen('document', 'click', `#stepplayer${newID}.stepplayerhtml .gifspeed`,(_this, self) => {
        let mod = _this.getAttribute('data-mod');
        let speed = _this.getAttribute('data-speed');
        let video = document.getElementById('vid' + mod);
        video.playbackRate = speed;
        document.querySelector('#stepplayer' + mod + ' .gifspeed').classList.remove('bg-l-grey font-weight-bold');
        _this.classList.add('bg-l-grey font-weight-bold');
    });

    AH.listen('document', 'click', `.stepplayer_fullscreen${player_id}`, (_this, self) => {
        let mod = _this.getAttribute('data-mod');
        let isshow = _this.getAttribute('data-value');
            if (isshow == 1) {
                document.querySelector('#stepplayer' + mod + ' .stepcaption').classList.remove('h')
            } else {
                document.querySelector('#stepplayer' + mod + ' .stepcaption').classList.add('h');
            }
            document.querySelector('#stepplayer' + mod + ' .subtitles').classList.remove('bg-l-grey font-weight-bold');
            _this.classList.add('bg-l-grey font-weight-bold');
    });

    AH.listen('document', 'click', `#stepplayer${newID} .subtitles`,(_this, self) => {
        toggleFullScreen(_this.parentNode.parentNode, self, '400px');
    });
}