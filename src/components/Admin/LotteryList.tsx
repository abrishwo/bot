const handleDrawWinner = async (lotteryId: string) => {
    try {
      const res = await fetch(`/api/lottery/draw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotteryId })
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(`🎉 Winner Selected: ${data.winnerTicket.userId}`);
      } else {
        alert(`❌ Draw failed: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Server error during draw');
    }
  };
  
  // In your component rendering:
  <button onClick={() => handleDrawWinner(lottery.id)}>
    🎲 Draw Winner
  </button>
  