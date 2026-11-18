'use client';
export default function DongFundaError({ reset }: { reset: () => void }) {
  return (
    <div className="df">
      <div className="df-container df-empty">
        <h1>ยังโหลดบทความไม่ได้</h1>
        <p>กรุณาลองอีกครั้งในอีกสักครู่</p>
        <button className="df-button df-button-primary" onClick={reset}>
          ลองอีกครั้ง
        </button>
      </div>
    </div>
  );
}
