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