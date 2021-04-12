import images from "../gallery-items.js";

const getMurkupWidthImages = images
  .map(
    (img) => `
    <li class="gallery__item">
      <a
        class="gallery__link"
        href="${img.original}"
      >
        <img
          class="gallery__image"
          src="${img.preview}"
          data-source="${img.original}"
          alt="${img.description}"
        />
      </a>
    </li>
  `
  )
  .join("");

const galleryRef = document.querySelector(".js-gallery");
const renderGallery = (markup) => {
  galleryRef.insertAdjacentHTML("afterbegin", markup);
};

renderGallery(getMurkupWidthImages);

const modalRef = document.querySelector(".js-lightbox");
const modalCloseButton = document.querySelector(
  '[data-action="close-lightbox"]'
);
const originalImageInModalRef = document.querySelector(".lightbox__image");
let activeImg = -1;

const closeModal = () => {
  originalImageInModalRef.src = "";
  originalImageInModalRef.alt = "";
  modalRef.classList.remove("is-open");
};

const setImgToModalByIndex = (index) => {
  const { original, description } = images[index];

  originalImageInModalRef.src = original;
  originalImageInModalRef.alt = description;
};
const closeModalWithKey = (e) => {
  if (e.key === "Escape") {
    closeModal();
    document.body.removeEventListener("keydown", closeModalWithKey);
    document.body.removeEventListener("keydown", paginationGallery);
  }
};

const paginationGallery = (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") {
    return;
  }

  if (e.key === "ArrowRight") {
    activeImg = activeImg === images.length - 1 ? 0 : (activeImg += 1);
  }
  if (e.key === "ArrowLeft") {
    activeImg = activeImg === 0 ? images.length - 1 : (activeImg -= 1);
  }

  setImgToModalByIndex(activeImg);
};

const getIndexOfImg = (originalUrl) =>
  images.map((el) => el.original).indexOf(originalUrl);

galleryRef.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.nodeName !== "IMG") {
    return false;
  }
  // Открытие модалки

  activeImg = getIndexOfImg(e.target.dataset.source);
  setImgToModalByIndex(activeImg);
  modalRef.classList.add("is-open");

  //  Обработчики
  const overlay = document.querySelector(".lightbox__overlay");
  overlay.addEventListener("click", closeModal, { once: true });
  modalCloseButton.addEventListener("click", closeModal, { once: true });
  document.body.addEventListener("keydown", closeModalWithKey);

  document.body.addEventListener("keydown", paginationGallery);
});
