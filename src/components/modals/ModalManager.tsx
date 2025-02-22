import React, { useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

export default function ModalManager({ isOpen, setIsOpen }: any) {
    const [modal, setModal] = useState(false);
    return (
        <div>
            {modal === false ? (
                <LoginModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    setModal={setModal}
                />
            ) : (
                <SignUpModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    setModal={setModal}
                />
            )}
        </div>
    );
}
