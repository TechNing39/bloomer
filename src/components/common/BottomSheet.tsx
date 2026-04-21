interface BottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export default function BottomSheet({ children, isOpen }: BottomSheetProps) {
  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-10
        bg-white rounded-t-2xl shadow-xl
        transition-transform duration-300
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      {/* 핸들 */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>
      {children}
    </div>
  );
}
