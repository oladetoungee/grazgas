import WidgetClient from '@/components/features/widget/widget';
import React, { Suspense } from 'react';

const Widget = () => {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-sm text-gray-500 text-center">
          Loading widget...
        </div>
      }
    >
      <WidgetClient />
    </Suspense>
  );
};

export default Widget;
