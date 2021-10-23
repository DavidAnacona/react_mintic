import { useState } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggleModal() {
    setIsShowing(!isShowing);
  }

  function closeModal() {
    setIsShowing(false);
  }

  function openModal() {
    setIsShowing(true);
  }

  return {
    isOpen: isShowing,
    toggleModal,
    openModal,
    closeModal
  };
};

export default useModal;
