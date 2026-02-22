"use client";

import { useRef, useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLanguage } from "@/context/LanguageContext";
import { portfolio } from "@/lib/portfolio";
import { gsap } from "gsap";

import { FaGithub, FaEnvelope, FaLinkedin, FaFacebook, FaPhone, FaLink } from "react-icons/fa";

export default function Contact() {
  const {
    contactFormVisible,
    setContactFormVisible,
    showToast,
  } = usePortfolio();
  const { t } = useLanguage();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.querySelector<HTMLInputElement>('input[name="name"]');
    const email = form.querySelector<HTMLInputElement>('input[name="email"]');
    const message = form.querySelector<HTMLTextAreaElement>(
      'textarea[name="message"]'
    );

    if (!name || !email || !message) return;

    [name, email, message].forEach((el) => el.classList.remove("!border-red-500"));

    let isValid = true;
    if (!name.value.trim()) {
      name.classList.add("!border-red-500");
      isValid = false;
    }
    if (!email.value.trim() || !email.value.includes("@")) {
      email.classList.add("!border-red-500");
      isValid = false;
    }
    if (!message.value.trim()) {
      message.classList.add("!border-red-500");
      isValid = false;
    }

    if (!isValid) {
      showToast(t("toast.missingInfo"), t("toast.missingInfoMessage"));
      return;
    }

    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const originalText = btn?.textContent ?? "";

    setSending(true);
    if (btn) {
      btn.textContent = t("contact.sending");
      btn.disabled = true;
    }

    setTimeout(() => {
      setSending(false);
      setSent(true);
      showToast(t("toast.success"), t("toast.successMessage"), false);
      if (btn) {
        btn.textContent = t("contact.sent");
        btn.classList.add("bg-green-500", "text-white", "border-green-500");
      }

      setTimeout(() => {
        form.reset();
        [name, email, message].forEach((el) =>
          el.classList.remove("!border-red-500")
        );
        setSent(false);
        if (btn) {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.classList.remove(
            "bg-green-500",
            "text-white",
            "border-green-500"
          );
        }
        setContactFormVisible(false);
      }, 1500);
    }, 1500);
  };

  const handleToggleForm = (show: boolean) => {
    setContactFormVisible(show);
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        scale: show ? 0.5 : 1,
        opacity: show ? 0.3 : 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      id="contact"
      data-theme="light"
      className={`relative w-screen max-w-full overflow-x-hidden min-h-[80vh] bg-white text-black flex flex-col py-20 border-t-4 border-black z-0 transition-all ${
        contactFormVisible ? "justify-center" : "justify-center items-center"
      }`}
    >
      <div className="text-center mb-12 relative w-full z-10 gsap-fade-up">
        <h2
          ref={titleRef}
          className="text-[clamp(3rem,12vw,6rem)] md:text-[8rem] font-black text-black mb-8 uppercase tracking-tighter mix-blend-multiply scroll-float-text break-all sm:break-normal px-4"
        >
          {t("contact.title")}
        </h2>
      </div>

      {!contactFormVisible ? (
        <div className="scroll-float bg-black text-white border-4 border-black p-6 sm:p-12 shadow-[8px_8px_0px_0px_#000] sm:shadow-[12px_12px_0px_0px_#000] rotate-1 hover:rotate-0 transition-transform duration-300 max-w-[calc(100vw-2rem)] sm:max-w-2xl w-full mx-4 relative gsap-fade-up">
          <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-6 bg-white text-black border-[3px] border-black p-1.5 sm:p-2 text-xs sm:text-base font-black rotate-12 shadow-neo z-20">
            {t("contact.openToWork")}
          </div>

          <h3 className="text-3xl sm:text-4xl font-black mb-8 border-b-4 border-white pb-4">
            {t("contact.getInTouch")}
          </h3>

          <div id="contact-options" className="flex flex-col gap-4 sm:gap-6">
            {portfolio.contact.map((item) => (
              <a
                key={item.type}
                href={item.url}
                target={item.url.startsWith("http") ? "_blank" : undefined}
                rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-lg sm:text-2xl font-bold flex items-center gap-3 sm:gap-4 hover:bg-white hover:text-black hover:p-1 sm:hover:px-2 transition-all group relative z-10 break-all sm:break-normal"
              >
                <span className="w-8 h-8 rounded-none border-2 border-white flex items-center justify-center text-[16px] group-hover:border-black group-hover:bg-black group-hover:text-white shrink-0">
                  {item.type === "email" ? <FaEnvelope /> : item.type === "github" ? <FaGithub /> : item.type === "linkedin" ? <FaLinkedin /> : item.type === "facebook" ? <FaFacebook /> : item.type === "phone" ? <FaPhone /> : <FaLink />}
                </span>
                {item.label}
              </a>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t-2 border-white/30">
            <button
              type="button"
              onClick={() => handleToggleForm(true)}
              className="glare-auto glare-black w-full bg-white text-black font-black py-4 uppercase border-4 border-transparent hover:border-black hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_0px_#333] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              {t("contact.sendMessage")}
            </button>
          </div>
        </div>
      ) : (
        <div className="scroll-float bg-black text-white border-4 border-black p-6 sm:p-12 shadow-[8px_8px_0px_0px_#000] sm:shadow-[12px_12px_0px_0px_#000] max-w-[calc(100vw-2rem)] sm:max-w-2xl w-full mx-4 relative gsap-fade-up">
          <button
            type="button"
            onClick={() => handleToggleForm(false)}
            className="absolute top-4 right-4 text-white border-2 border-white px-2 py-1 font-mono text-sm hover:bg-white hover:text-black"
          >
            {t("contact.back")}
          </button>

          <h3 className="text-3xl sm:text-4xl font-black mb-8 border-b-4 border-white pb-4">
            {t("contact.sendMessageTitle")}
          </h3>

          <form
            id="contact-form"
            onSubmit={handleSendMessage}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder={t("contact.formName")}
              className="w-full bg-white text-black border-4 border-black p-3 font-mono focus:outline-none focus:ring-2 focus:ring-white"
            />
            <input
              type="email"
              name="email"
              placeholder={t("contact.formEmail")}
              className="w-full bg-white text-black border-4 border-black p-3 font-mono focus:outline-none focus:ring-2 focus:ring-white"
            />
            <textarea
              name="message"
              placeholder={t("contact.formMessage")}
              rows={5}
              className="w-full bg-white text-black border-4 border-black p-3 font-mono focus:outline-none focus:ring-2 focus:ring-white resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="glare-auto glare-black w-full bg-white text-black font-black py-4 uppercase border-4 border-black hover:border-black hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_0px_#333] hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-70"
            >
              {sending ? t("contact.sending") : sent ? t("contact.sent") : t("contact.send")}
            </button>
          </form>
        </div>
      )}

      <footer className="absolute bottom-4 text-black font-mono font-bold text-xs uppercase w-full text-center">
        {t("footer.copyright")}
      </footer>
    </section>
  );
}
