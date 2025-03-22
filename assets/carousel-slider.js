class CarouselSlider extends HTMLElement {
    constructor() {
      super();
      this.slides = this.querySelectorAll(".slider__item");
      if (this.slides.length < 2) return;
      window.initLazyScript(this, this.init.bind(this));
    }
  
    disconnectedCallback() {
      window.removeEventListener(
        "on:breakpoint-change",
        this.breakpointChangeHandler
      );
    }
  
    init() {
      this.slider = this.querySelector(".slider");
      this.grid = this.querySelector(".slider__grid");
      this.nav = this.querySelector(".slider-nav");
      this.mobileNav =
      this.closest(".section")?.querySelector(".mobile-slider-nav");
      this.rtl = document.dir === "rtl";
      this.breakpointChangeHandler =
        this.breakpointChangeHandler || this.handleBreakpointChange.bind(this);
  
      if (this.nav) {
        this.prevBtn = this.querySelector('button[name="prev"]');
        this.nextBtn = this.querySelector('button[name="next"]');
      }
  
      if (this.mobileNav) {
        this.mobilePrevBtn = this.mobileNav.querySelector(
          'button[name="prev-mobile"]'
        );
        this.mobileNextBtn = this.mobileNav.querySelector(
          'button[name="next-mobile"]'
        );
      }
  
      this.initSlider();
      window.addEventListener(
        "on:breakpoint-change",
        this.breakpointChangeHandler
      );
    }
  
    initSlider() {
      if (
        !(
          this.getAttribute("disable-mobile") &&
          !window.matchMedia(window.theme.mediaQueries.sm).matches
        ) &&
        !(
          this.getAttribute("disable-desktop") &&
          window.matchMedia(window.theme.mediaQueries.sm).matches
        )
      ) {
        this.gridWidth = this.grid.clientWidth;
  
        // Distance between leading edges of adjacent slides (i.e. width of card + gap).
        this.slideSpan =
          this.getWindowOffset(this.slides[1]) -
          this.getWindowOffset(this.slides[0]);
  
        // Width of gap between slides.
        this.slideGap = this.slideSpan - this.slides[0].clientWidth;
  
        this.slidesPerPage = Math.round(
          (this.gridWidth + this.slideGap) / this.slideSpan
        );
        this.slidesToScroll =
          window.theme.settings.sliderItemsPerNav === "page" ? this.slidesPerPage : 1;
        this.totalPages = this.slides.length - this.slidesPerPage + 1;
  
        this.setCarouselState(this.totalPages > 1);
        if (this.totalPages < 2) return;
  
        this.sliderStart = this.getWindowOffset(this.slider);
        if (!this.sliderStart)
          this.sliderStart = (this.slider.clientWidth - this.gridWidth) / 2;
        this.sliderEnd = this.sliderStart + this.gridWidth;
  
        if (window.matchMedia("(pointer: fine)").matches) {
          this.slider.classList.add("is-grabbable");
        }
  
        this.addListeners();
        this.setButtonStates();
      } else {
        this.setAttribute("inactive", "");
      }
  
      // Init the custom scrollbars
      if (
        !this.slider.classList.contains("slider--no-scrollbar") &&
        window.OverlayScrollbarsGlobal
      ) {
        window.OverlayScrollbarsGlobal.OverlayScrollbars(
          {
            target: this.slider.parentElement,
            elements: {
              viewport: this.slider,
            },
          },
          {}
        );
      }
    }
  
    addListeners() {
      if (this.nav) {
        this.scrollHandler = debounce(this.handleScroll.bind(this));
        this.navClickHandler = this.handleNavClick.bind(this);
  
        this.slider.addEventListener("scroll", this.scrollHandler);
        this.prevBtn.addEventListener("click", this.navClickHandler);
        this.nextBtn.addEventListener("click", this.navClickHandler);
      }
  
      if (this.mobileNav) {
        this.scrollHandler = debounce(this.handleScroll.bind(this));
        this.navClickHandler = this.handleNavClick.bind(this);
  
        this.slider.addEventListener("scroll", this.scrollHandler);
        this.mobilePrevBtn.addEventListener("click", this.navClickHandler);
        this.mobileNextBtn.addEventListener("click", this.navClickHandler);
      }
  
      if (window.matchMedia("(pointer: fine)").matches) {
        this.mousedownHandler = this.handleMousedown.bind(this);
        this.mouseupHandler = this.handleMouseup.bind(this);
        this.mousemoveHandler = this.handleMousemove.bind(this);
  
        this.slider.addEventListener("mousedown", this.mousedownHandler);
        this.slider.addEventListener("mouseup", this.mouseupHandler);
        this.slider.addEventListener("mouseleave", this.mouseupHandler);
        this.slider.addEventListener("mousemove", this.mousemoveHandler);
      }
    }
  
    removeListeners() {
      if (this.nav) {
        this.slider.removeEventListener("scroll", this.scrollHandler);
        this.prevBtn.addEventListener("click", this.navClickHandler);
        this.nextBtn.addEventListener("click", this.navClickHandler);
      }
  
      if (this.mobileNav) {
        this.slider.addEventListener("scroll", this.scrollHandler);
        this.mobilePrevBtn.addEventListener("click", this.navClickHandler);
        this.mobileNextBtn.addEventListener("click", this.navClickHandler);
      }
  
      this.slider.removeEventListener("mousedown", this.mousedownHandler);
      this.slider.removeEventListener("mouseup", this.mouseupHandler);
      this.slider.removeEventListener("mouseleave", this.mouseupHandler);
      this.slider.removeEventListener("mousemove", this.mousemoveHandler);
    }
  
    /**
     * Handles 'scroll' events on the slider element.
     */
    handleScroll() {
      this.currentIndex = Math.round(this.slider.scrollLeft / this.slideSpan);
      this.setButtonStates();
    }
  
    /**
     * Handles 'mousedown' events on the slider element.
     * @param {object} evt - Event object.
     */
    handleMousedown(evt) {
      this.mousedown = true;
      this.startX = evt.pageX - this.sliderStart;
      this.scrollPos = this.slider.scrollLeft;
      this.slider.classList.add("is-grabbing");
    }
  
    /**
     * Handles 'mouseup' events on the slider element.
     */
    handleMouseup() {
      this.mousedown = false;
      this.slider.classList.remove("is-grabbing");
    }
  
    /**
     * Handles 'mousemove' events on the slider element.
     * @param {object} evt - Event object.
     */
    handleMousemove(evt) {
      if (!this.mousedown) return;
      evt.preventDefault();
  
      const x = evt.pageX - this.sliderStart;
      this.slider.scrollLeft = this.scrollPos - (x - this.startX) * 2;
    }
  
    /**
     * Handles 'click' events on the nav buttons container.
     * @param {object} evt - Event object.
     */
    handleNavClick(evt) {
      if (!evt.target.matches(".slider-nav__btn")) {
        return;
      }
  
      const isMobile = evt.target.name === "next-mobile";
  
      if (!isMobile) {
        if (
          (evt.target.name === "next" && !this.rtl) ||
          (evt.target.name === "prev" && this.rtl)
        ) {
          this.scrollPos =
            this.slider.scrollLeft + this.slidesToScroll * this.slideSpan;
        } else {
          this.scrollPos =
            this.slider.scrollLeft - this.slidesToScroll * this.slideSpan;
        }
      } else {
        if (
          (evt.target.name === "next-mobile" && !this.rtl) ||
          (evt.target.name === "prev-mobile" && this.rtl)
        ) {
          this.scrollPos =
            this.slider.scrollLeft + this.slidesToScroll * this.slideSpan;
        } else {
          this.scrollPos =
            this.slider.scrollLeft - this.slidesToScroll * this.slideSpan;
        }
      }
  
      this.slider.scrollTo({ left: this.scrollPos, behavior: "smooth" });
    }
  
    /**
     * Handles 'on:breakpoint-change' events on the window.
     */
    handleBreakpointChange() {
      this.removeListeners();
      this.initSlider();
    }
  
    /**
     * Gets the offset of an element from the edge of the viewport (left for ltr, right for rtl).
     * @param {number} el - Element.
     * @returns {number}
     */
    getWindowOffset(el) {
      return this.rtl
        ? window.innerWidth - el.getBoundingClientRect().right
        : el.getBoundingClientRect().left;
    }
  
    /**
     * Gets the visible state of a slide.
     * @param {Element} el - Slide element.
     * @returns {boolean}
     */
    getSlideVisibility(el) {
      const slideStart = this.getWindowOffset(el);
      const slideEnd = Math.floor(slideStart + this.slides[0].clientWidth);
      return slideStart >= this.sliderStart && slideEnd <= this.sliderEnd;
    }
  
    /**
     * Sets the active state of the carousel.
     * @param {boolean} active - Set carousel as active.
     */
    setCarouselState(active) {
      if (active) {
        this.removeAttribute("inactive");
  
        // If slider width changed when activated, reinitialise it.
        if (this.gridWidth !== this.grid.clientWidth) {
          this.handleBreakpointChange();
        }
      } else {
        this.setAttribute("inactive", "");
      }
    }
  
    /**
     * Sets the disabled state of the nav buttons.
     */
    setButtonStates() {
      if (!this.prevBtn && !this.nextBtn) {
        return;
      }
      if (!this.mobilePrevBtn && !this.mobileNextBtn) {
        return;
      }
  
      this.mobilePrevBtn.disabled =
        this.getSlideVisibility(this.slides[0]) && this.slider.scrollLeft === 0;
      this.mobileNextBtn.disabled = this.getSlideVisibility(
        this.slides[this.slides.length - 1]
      );
      this.prevBtn.disabled =
        this.getSlideVisibility(this.slides[0]) && this.slider.scrollLeft === 0;
      this.nextBtn.disabled = this.getSlideVisibility(
        this.slides[this.slides.length - 1]
      );
    }
  }
  
  customElements.define("carousel-slider", CarouselSlider);