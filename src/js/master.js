var sidenav, popularWaterSlider, popularCoolerSlider, actionsSlider, tabs, modal, datepicker;
var storedImage;

$(() => {
    $(window).on('scroll', updateNavbar);
    $('body').on('click', '.filter a', setFilter);
    $('body').on('click', '.filter span', cycleFilter);
    $('body').on('click', '.gallery-pagination a', setGalleryImage);
    $('body').on('change', '[name="use_addr"]', updateAddressField);
    $('body').on('change', '.toggle-group', toggleGroup);
    $('body').on('click', '.history>tbody>tr', expandDetails);
    $('body').on('click', '.tabs-href', selectProductTab)
    init();
});

//= Сохранение URL картинки перед ее открытием в полный экран =============
function storeDataImage(){
    storedImage = $(this.el).css('background-image');
}

//= Восстановление URL карнтинки после ее закрытия из полноэкранного режима
function restoreDataImage(){
    $(this.el).css({
        backgroundImage: storedImage
    })
}

function init(){

    tabs = M.Tabs.init(document.querySelectorAll('.tabs'));
    sidenav = M.Sidenav.init(document.querySelector('.sidenav'));
    modal = M.Modal.init(document.querySelectorAll('.modal'));
    initImageToolTips();

    $('.materialboxed').materialbox({
        onOpenStart: storeDataImage,
        onCloseEnd: restoreDataImage
    });
    
    if($('#popular-water-slider').length){
        let waterOptions = swiperOptions('#water-slider-extras');
        popularWaterSlider = new Swiper('#popular-water-slider', waterOptions);
        popularWaterSlider.on('slideChange', function(){
            $('.lazy').lazy();
        })
    }
    
    if($('#popular-coolers-slider').length){
        let coolerOptions = swiperOptions('#cooler-slider-extras');
        popularCoolerSlider = new Swiper('#popular-coolers-slider', coolerOptions);
        popularCoolerSlider.on('slideChange', function(){
            $('.lazy').lazy();
        })
    }

    if($('#actions-slider').length){
        actionsSlider = new Swiper('#actions-slider', {
            pagination: {
                "el": ".swiper-pagination",
                "type": "bullets",
                "clickable": true
            },
            loop: true,
            autoplay: {
                delay: 5000
            }
        });
        actionsSlider.on('slideChange', function(){
            $('.lazy').lazy();
        });
        window.dispatchEvent(new Event('resize'));
    }

    $('p').hyphenate();

    $('.lazy').lazy();
    autosize(document.querySelectorAll('textarea'));

    if($('.gallery-pagination').length){

        var img = $($('.gallery-pagination li.active a')[0]).data('img');
        
        $('.product-image').css({
            backgroundImage: "url(" + img + ")"
        })
    }

    datepicker = M.Datepicker.init(document.querySelectorAll('.datepicker'), {
        firstDay: 1,
        container: 'body',
        format: 'dd mmmm yyyy',
        i18n:{
            'months': [
                'Январь',
                'Февраль',
                'Март',
                'Апрель',
                'Май',
                'Июнь',
                'Июль',
                'Август',
                'Сентябрь',
                'Октябрь',
                'Ноябрь',
                'Декабрь'
            ],
            monthsShort:[
                'Янв',
                'Фев',
                'Мрт',
                'Апр',
                'Май',
                'Июн',
                'Июл',
                'Авг',
                'Сен',
                'Окт',
                'Ноя',
                'Дек'
            ],
            weekdays:[
                'Воскресенье',
                'Понедельник',
                'Вторник',
                'Среда',
                'Четверг',
                'Пятница',
                'Суббота'
            ],
            weekdaysShort:[
                'Вс',
                'Пн',
                'Вт',
                'Ср',
                'Чт',
                'Пт',
                'Сб'
            ],
            weekdaysAbbrev:[
                'В',
                'П',
                'В',
                'С',
                'Ч',
                'П',
                'С'
                
            ]
        }
    });

    if($('#map').length){
        loadScript("https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.4.3/build/ol.js", () => {
            initMap();
        })
    }

}

//= Обработчики событий =============
function selectProductTab(e){

    var locationBase = window.location.href.split(/[?#]/)[0];
    var hrefBase = this.href.split(/[?#]/)[0];

    if(locationBase === hrefBase){
        e.preventDefault();
        var anchor = this.href.split('#').pop();
        
        if($('#profile-tabs').length){

            tabs[0].select(anchor);

            sidenav.close();
        }
    }
}
function expandDetails(e){

	var path = e.originalEvent.path || composedPath(e.target);
	var links = $(path).filter((index, el) => {
		return el.tagName == 'A'
	});

	if(!links.length){

        let newClass = $(this).hasClass('active') ? '' : 'active';
        $('.history>tbody>tr').removeClass('active');
        $(this).addClass(newClass);

		e.preventDefault();
		var already = $(this).next().find('.subtable-wrapper').css('display') == 'block';
		$('.subtable-wrapper').slideUp('fast');
		if(!already){
			$(this).next().find('.subtable-wrapper').slideDown('fast');
		}
	}

}
function composedPath (el) {

    var path = [];

    while (el) {

        path.push(el);

        if (el.tagName === 'HTML') {

            path.push(document);
            path.push(window);

            return path;
       }

       el = el.parentElement;
    }
}
function toggleGroup(e){
	var group = $(this).data('target');
	$('[data-group="'+group+'"]').toggleClass('visible');
}
function updateAddressField(e){
	if($(this).val() == 0){
		$('#user-address').removeClass('hidden');
	}else{
		$('#user-address').addClass('hidden');
	}
}
function setGalleryImage(){

    let img = $(this).data('img');

    $('.product-image').css({
        backgroundImage: "url(" + img + ")"
    })

    $(this).parents('.gallery-pagination').find('li').removeClass('active');
    $(this).parent().addClass('active');
}
function cycleFilter(){

    let parent = $(this).parents('.filter');
    let link = parent.find('a');
    let activeLink = parent.find('.active')[0] || link[0];
    let activeActual = $(activeLink).hasClass('active');
    let linkIndex = link.toArray().indexOf(activeLink);    
    let nextIndex = (linkIndex + 1) >= link.length ? 0 : linkIndex + 1;

    link.removeClass('active');
    
    if(link.length === 1){
        if(!activeActual){
            $(activeLink).addClass('active');
        }
    }else{
        if(activeActual){
            $(link[nextIndex]).addClass('active');
        }else{
            $(link[0]).addClass('active');
        }
    }

}
function updateNavbar(){
    var navbar_pos = $('nav').position().top;
    var scroll_pos = navbar_pos - $('html, body').scrollTop();

    if(scroll_pos < 0){
        $('nav').addClass('fixed');
    }else{
        $('nav').removeClass('fixed');
    }
}
function setFilter(e){

    e.preventDefault();
    let already = $(this).hasClass('active');
    let newClass = already ? '' : 'active';

    $(this).parents('.filter').find('a').removeClass('active');
    $(this).addClass(newClass);
}

//= Разные функции ==================
function swiperOptions(paginationEl){

    return sliderOptions = {
        spaceBetween: 20,
        loop: true,
        pagination: {
            el: paginationEl,
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1
            },
            600: {
                slidesPerView: 2
            },
            1000: {
                slidesPerView: 3
            },
            1400: {
                slidesPerView: 4,
            },
            1650: {
                slidesPerView: 5
            },
            1800: {
                slidesPerView: 6
            }
        }
    }
}

//= Асинхронная загрузка скриптов =========================================
loadScript = (url, callback) => {

	var script = document.createElement("script")
	script.type = "text/javascript";

	if (script.readyState){  //IE
		script.onreadystatechange = function(){
			if (script.readyState == "loaded" ||
					script.readyState == "complete"){
				script.onreadystatechange = null;
				callback();
			}
		};
	} else {  //Others
		script.onload = function(){
			callback();
		};
	}

	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

//= Инициализация карты ===================================================
function initMap(){

    // 44.7267618,37.7400938
    coords = [37.7400938, 44.7267618];
    
    var style = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [.5, 1],
            src: '/img/map_marker.png'
        })
    });
    
    var marker = new ol.Feature({
        type: 'icon',
        geometry: new ol.geom.Point(ol.proj.fromLonLat(coords))
    })

    var vectorSource = new ol.source.Vector({
        features: [marker]
    })

    var vectorLayer = new ol.layer.Vector({
		source: vectorSource,
        style: style
	});

    // Shift map center to provide place for overlay
    var center = [
        coords[0], 
        coords[1]
    ]

    map = new ol.Map({
        target: 'map',  // The DOM element that will contains the map
        interactions: ol.interaction.defaults({mouseWheelZoom:false}), //Disable scroll event
		renderer: 'canvas', // Force the renderer to be used
		layers: [
			// Add a new Tile layer getting tiles from OpenStreetMap source
			new ol.layer.Tile({
				source: new ol.source.OSM({
					url: "https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
				})
			}),
			vectorLayer
		],
		// Create a view centered on the specified location and zoom level

		view: new ol.View({
			center: ol.proj.fromLonLat(center),
			zoom: 17
		})
    });  
    
    // Эвент по клику на маркере
    map.on('click', function(evt) {
        var f = map.forEachFeatureAtPixel(
            evt.pixel,
            function(ft, layer){return ft;}
        );
        if (f && f.get('type') == 'icon') {
            var linkEl = $('<a href="https://goo.gl/maps/KQYmVFwvvH7FYZYZ6" target="_blank">Google</a>');
            $('#map').append(linkEl);
            linkEl[0].click();
            $(linkEl).remove();
        }        
    });

    map.on("pointermove", function (evt) {
        var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            return true;
        }); 
        if (hit) {
            this.getTargetElement().style.cursor = 'pointer';
        } else {
            this.getTargetElement().style.cursor = '';
        }
    });
}

//= Инициализация фото-тултипов ===========================================
function initImageToolTips(){
    $('.image-tooltip').each((index, tooltip) => {
        var url = $(tooltip).data('src');
        // console.log(url)
        $(tooltip).prepend($("<div class=\"image-tooltip\" style=\"background-image:url('"+url+"')\">"));
    })
}