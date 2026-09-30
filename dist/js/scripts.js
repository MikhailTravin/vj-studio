const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        setTimeout((() => {
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = "";
            }));
            document.body.style.paddingRight = "";
            document.documentElement.classList.remove("lock");
        }), delay);
        bodyLockStatus = false;
        setTimeout((function () {
            bodyLockStatus = true;
        }), delay);
    }
};
let bodyLock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
        lockPaddingElements.forEach((lockPaddingElement => {
            lockPaddingElement.style.paddingRight = lockPaddingValue;
        }));
        document.body.style.paddingRight = lockPaddingValue;
        document.documentElement.classList.add("lock");
        bodyLockStatus = false;
        setTimeout((function () {
            bodyLockStatus = true;
        }), delay);
    }
};
function functions_FLS(message) {
    setTimeout((() => {
        if (window.FLS) console.log(message);
    }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout((() => {
            target.hidden = !showmore ? true : false;
            !showmore ? target.style.removeProperty("height") : null;
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            !showmore ? target.style.removeProperty("overflow") : null;
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideUpDone", {
                detail: {
                    target
                }
            }));
        }), duration);
    }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.hidden = target.hidden ? false : null;
        showmore ? target.style.removeProperty("height") : null;
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout((() => {
            target.style.removeProperty("height");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideDownDone", {
                detail: {
                    target
                }
            }));
        }), duration);
    }
};
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
    if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
    const media = Array.from(array).filter(function (item) {
        return item.dataset[dataSetValue];
    });

    if (media.length) {
        const breakpointsArray = media.map(item => {
            const params = item.dataset[dataSetValue];
            const paramsArray = params.split(",");
            return {
                value: paramsArray[0],
                type: paramsArray[1] ? paramsArray[1].trim() : "max",
                item: item
            };
        });

        const mdQueries = uniqArray(
            breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
        );

        const mdQueriesArray = mdQueries.map(breakpoint => {
            const [query, value, type] = breakpoint.split(",");
            const matchMedia = window.matchMedia(query);
            const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
            return { itemsArray, matchMedia };
        });

        return mdQueriesArray;
    }
}

function uniqArray(array) {
    return array.filter(function (item, index, self) {
        return self.indexOf(item) === index;
    });
}

//========================================================================================================================================================

//Прокрутка к блоку
let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
    const targetBlockElement = document.querySelector(targetBlock);

    if (!targetBlockElement) {
        console.warn(`Element ${targetBlock} not found`);
        return;
    }

    let headerItem = '';
    let headerItemHeight = 0;

    if (noHeader) {
        headerItem = 'header.header';
        const headerElement = document.querySelector(headerItem);
        if (headerElement) {
            if (!headerElement.classList.contains('_header-scroll')) {
                headerElement.style.cssText = `transition-duration: 0s;`;
                headerElement.classList.add('_header-scroll');
                headerItemHeight = headerElement.offsetHeight;
                headerElement.classList.remove('_header-scroll');
                setTimeout(() => {
                    headerElement.style.cssText = ``;
                }, 0);
            } else {
                headerItemHeight = headerElement.offsetHeight;
            }
        }
    }

    if (document.documentElement.classList.contains("menu-open")) {
        if (typeof menuClose === 'function') {
            menuClose();
        }
    }

    if (typeof SmoothScroll !== 'undefined') {
        let options = {
            speedAsDuration: true,
            speed: speed,
            header: headerItem,
            offset: offsetTop,
            easing: 'easeOutQuad',
        };
        new SmoothScroll().animateScroll(targetBlockElement, '', options);
    } else {
        let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + window.scrollY;

        if (headerItemHeight) {
            targetBlockElementPosition -= headerItemHeight;
        }

        if (offsetTop) {
            targetBlockElementPosition -= offsetTop;
        }

        window.scrollTo({
            top: targetBlockElementPosition,
            behavior: "smooth"
        });
    }
};
function pageNavigation() {
    document.addEventListener("click", pageNavigationAction);
    document.addEventListener("watcherCallback", pageNavigationAction);

    function pageNavigationAction(e) {
        if (e.type === "click") {
            const targetElement = e.target;
            const gotoLink = targetElement.closest('[data-goto]');

            if (gotoLink) {
                const gotoLinkSelector = gotoLink.dataset.goto || '';
                const noHeader = gotoLink.hasAttribute('data-goto-header');
                const gotoSpeed = gotoLink.dataset.gotoSpeed ? parseInt(gotoLink.dataset.gotoSpeed) : 500;
                const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;

                if (window.modules_flsModules && modules_flsModules.fullpage) {
                    const fullpageSection = document.querySelector(`${gotoLinkSelector}`)?.closest('[data-fp-section]');
                    const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;

                    if (fullpageSectionId !== null) {
                        modules_flsModules.fullpage.switchingSection(fullpageSectionId);
                        if (document.documentElement.classList.contains("menu-open") && typeof menuClose === 'function') {
                            menuClose();
                        }
                    }
                } else {
                    gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                }

                e.preventDefault();
            }
        } else if (e.type === "watcherCallback" && e.detail) {
            const entry = e.detail.entry;
            const targetElement = entry.target;

            if (targetElement.dataset.watch === 'navigator') {
                document.querySelectorAll('[data-goto]._navigator-active').forEach(el => {
                    el.classList.remove('_navigator-active');
                });

                const navigatorLinks = findNavigatorLinks(targetElement);
                navigatorLinks.forEach(link => {
                    if (entry.isIntersecting) {
                        link.classList.add('_navigator-active');
                    } else {
                        link.classList.remove('_navigator-active');
                    }
                });
            }
        }
    }

    function findNavigatorLinks(element) {
        const links = [];

        if (element.id) {
            const idLinks = document.querySelectorAll(`[data-goto="#${element.id}"]`);
            links.push(...idLinks);
        }

        if (element.classList.length) {
            element.classList.forEach(className => {
                const classLinks = document.querySelectorAll(`[data-goto=".${className}"]`);
                links.push(...classLinks);
            });
        }

        return links;
    }
}
pageNavigation();

//========================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {

    var MOBILE_BREAKPOINT = 767;

    var isMobile = function () {
        return window.matchMedia('(max-width: ' + MOBILE_BREAKPOINT + 'px)').matches;
    };

    // Ставим центр круга в центр кнопки — круг растёт именно из неё
    function setCircleOrigin(circle, btn) {
        if (!circle || !btn) return;
        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        circle.style.top = cy + 'px';
        circle.style.left = cx + 'px';
    }

    // Сбрасываем все inline-стили, которые мог наставить JS
    function resetPopupInlineStyles(pop, content) {
        pop.style.removeProperty('display');
        pop.style.removeProperty('width');
        pop.style.removeProperty('height');
        pop.style.removeProperty('opacity');
        pop.style.removeProperty('visibility');
        pop.style.removeProperty('transition');
        pop.style.removeProperty('padding-right');

        if (content) {
            content.style.removeProperty('transition-delay');
        }
    }

    function openHashtagPopup(btn) {
        var block = btn.closest('.hashtag_block');
        var pop = block.querySelector('.hashtag_pop');
        var circle = block.querySelector('.hash_circle');
        var content = pop.querySelector('.pop_content');

        document.documentElement.classList.add('tag-open');

        setCircleOrigin(circle, btn);

        btn.classList.add('show');
        if (circle) circle.classList.add('show');

        if (isMobile()) {
            // Мобилка: сбрасываем возможные десктопные inline-стили
            resetPopupInlineStyles(pop, content);

            pop.classList.add('active');

            if (content) {
                content.classList.remove('active');
                content.style.transitionDelay = '0ms';
            }

            setTimeout(function () {
                if (content) {
                    content.style.transitionDelay = '0ms';
                    void content.offsetWidth;
                    content.classList.add('active');
                }
            }, 600);

            return;
        }

        // Десктоп: растягиваем попап из угла
        pop.style.display = 'block';
        pop.style.visibility = 'hidden';
        pop.style.width = 'auto';
        pop.style.height = 'auto';
        pop.style.opacity = '0';
        pop.style.transition = 'none';

        var targetW = pop.offsetWidth;
        var targetH = pop.offsetHeight;

        pop.style.width = '20px';
        pop.style.height = '20px';
        pop.style.visibility = '';

        void pop.offsetWidth;

        pop.style.transition =
            'width 900ms cubic-bezier(0.22, 1, 0.36, 1), ' +
            'height 900ms cubic-bezier(0.22, 1, 0.36, 1), ' +
            'opacity 0.4s ease';

        if (content) {
            content.style.transitionDelay = '550ms';
            content.classList.remove('active');
        }

        requestAnimationFrame(function () {
            pop.style.width = targetW + 'px';
            pop.style.height = targetH + 'px';
            pop.style.opacity = '1';
            pop.classList.add('active');
            if (content) content.classList.add('active');
        });
    }

    function closeHashtagPopup(closeBtn) {
        var pop = closeBtn.closest('.hashtag_pop');
        var block = pop.closest('.hashtag_block');
        var circle = block.querySelector('.hash_circle');
        var content = pop.querySelector('.pop_content');

        document.documentElement.classList.remove('tag-open');

        if (content) {
            content.style.transitionDelay = '0ms';
            content.classList.remove('active');
        }
        pop.classList.remove('active');

        if (isMobile()) {
            if (circle) circle.classList.remove('show');

            setTimeout(function () {
                var btn = block.querySelector('.hashtag_btn');
                if (btn) btn.classList.remove('show');
                // после закрытия на мобилке сбрасываем inline-стили,
                // чтобы при следующем открытии / ресайзе не было остатков
                resetPopupInlineStyles(pop, content);
            }, 900);

            return;
        }

        setTimeout(function () {
            pop.style.transition =
                'width 900ms cubic-bezier(0.22, 1, 0.36, 1), ' +
                'height 900ms cubic-bezier(0.22, 1, 0.36, 1), ' +
                'opacity 900ms ease';

            pop.style.width = '20px';
            pop.style.height = '20px';
            pop.style.opacity = '0';

            setTimeout(function () {
                var btn = block.querySelector('.hashtag_btn');
                if (btn) btn.classList.remove('show');
                // сбрасываем inline-стили после завершения анимации
                resetPopupInlineStyles(pop, content);
            }, 900);
        }, 350);
    }

    // === Обработка ресайза ===
    // Главное — при смене брейкпоинта сбросить inline-стили
    // и заново применить правильные для текущего режима.
    function handleResize() {
        var mobile = isMobile();

        document.querySelectorAll('.hashtag_block').forEach(function (block) {
            var pop = block.querySelector('.hashtag_pop');
            var circle = block.querySelector('.hash_circle');
            var btn = block.querySelector('.hashtag_btn');
            var content = pop ? pop.querySelector('.pop_content') : null;

            if (!pop) return;

            var isOpen = pop.classList.contains('active');

            if (!isOpen) {
                // Если попап закрыт — на всякий случай снимаем остатки
                resetPopupInlineStyles(pop, content);
                return;
            }

            // Сбрасываем inline-стили от предыдущего режима
            resetPopupInlineStyles(pop, content);

            if (mobile) {
                // Пересчитываем центр круга под новое положение кнопки
                setCircleOrigin(circle, btn);

                // Возвращаем видимость текста
                if (content) content.classList.add('active');
            } else {
                // Десктоп: заново измеряем и фиксируем размеры попапа
                pop.style.display = 'block';
                pop.style.width = 'auto';
                pop.style.height = 'auto';
                pop.style.transition = 'none';

                var newW = pop.offsetWidth;
                var newH = pop.offsetHeight;

                pop.style.width = newW + 'px';
                pop.style.height = newH + 'px';
                pop.style.opacity = '1';
                pop.style.transition = 'none';

                if (content) content.classList.add('active');
            }
        });

        // Если попапов открытых нет — снимаем класс с <html>
        var anyOpen = document.querySelector('.hashtag_pop.active');
        if (!anyOpen) {
            document.documentElement.classList.remove('tag-open');
        }
    }

    var resizeRaf = null;
    window.addEventListener('resize', function () {
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(function () {
            resizeRaf = null;
            handleResize();
        });
    });

    window.addEventListener('orientationchange', function () {
        setTimeout(handleResize, 200);
    });

    document.querySelectorAll('.hashtag_btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openHashtagPopup(this);
        });
    });

    document.querySelectorAll('.hashtag_pop .close_btn').forEach(function (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeHashtagPopup(this);
        });
    });

});