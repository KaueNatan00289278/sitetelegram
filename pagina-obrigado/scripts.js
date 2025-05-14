// Facebook Pixel Code
!function(f,b,e,v,n,t,s) {
  if(f.fbq)return;
  n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;
  n.push=n;
  n.loaded=!0;
  n.version='2.0';
  n.queue=[];
  t=b.createElement(e);
  t.async=!0;
  t.src=v;
  s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)
}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '2432135373820557');
fbq('track', 'PageView');

// Dispatch purchase event on load
window.addEventListener('load', function() {
  fbq('track', 'Purchase', {
    value: 5.90,
    currency: 'BRL'
  });

  // Add subtle animation to the CTA button
  setTimeout(() => {
    const button = document.querySelector('.vip-btn');
    if (button) {
      button.style.animation = 'pulse 2s infinite';
    }
  }, 3000);
});

// Add pulse animation to the button
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes pulse {
      0% {
        box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
      }
      50% {
        box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5);
      }
      100% {
        box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
      }
    }
  </style>
`);