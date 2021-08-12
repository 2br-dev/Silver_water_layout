var sidenav, popularWaterSlider, popularCoolerSlider, tabs, modal;

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

function init(){

    tabs = M.Tabs.init(document.querySelectorAll('.tabs'));
    sidenav = M.Sidenav.init(document.querySelector('.sidenav'));
    modal = M.Modal.init(document.querySelectorAll('.modal'));
    
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

    $('p').hyphenate();

    $('.lazy').lazy();
    autosize(document.querySelectorAll('textarea'));

    if($('.gallery-pagination').length){

        var img = $($('.gallery-pagination li.active a')[0]).data('img');
        
        $('.product-image').css({
            backgroundImage: "url(" + img + ")"
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
