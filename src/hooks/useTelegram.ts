export const useTelegram = () => {
    const tg = typeof window !== 'undefined' ? (window as any).Telegram.WebApp : null;
  
    const close = () => {
      tg?.close();
    };
  
    const ready = () => {
      tg?.ready();
    };
  
    const expand = () => {
      tg?.expand();
    };
  
    return {
      tg,
      close,
      ready,
      expand,
      user: tg?.initDataUnsafe?.user,
    };
  };
  