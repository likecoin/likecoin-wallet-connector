import React, { FC, HTMLAttributes } from 'react';

import { LikeCoinWalletConnectorMethodType } from '../types';

export interface Props extends HTMLAttributes<HTMLOrSVGElement> {
  type?: LikeCoinWalletConnectorMethodType;
}

function getIconViewBox(type?: LikeCoinWalletConnectorMethodType) {
  switch (type) {
    case LikeCoinWalletConnectorMethodType.MetaMaskLeap:
    case LikeCoinWalletConnectorMethodType.WalletConnectV2:
      return '0 0 64 64';
    default:
      return '0 0 32 32';
  }
}

function getIconPath(type?: LikeCoinWalletConnectorMethodType) {
  switch (type) {
    case LikeCoinWalletConnectorMethodType.Keplr:
    case LikeCoinWalletConnectorMethodType.KeplrMobile:
      return 'M6.4 0H25.6C29.1347 0 32 2.86539 32 6.4V25.6C32 29.1347 29.1347 32 25.6 32H6.4C2.86539 32 0 29.1347 0 25.6V6.4C0 2.86539 2.86539 0 6.4 0ZM11.264 17.28V27.2H7.04004V4.8H11.264V14.272L19.776 4.8H25.024V4.928L15.072 15.648L25.856 26.944V27.2H20.64L11.264 17.28Z';
    case LikeCoinWalletConnectorMethodType.LikerId:
      return 'M7.06354 5.61489C7.19783 5.50746 7.14412 5.35971 7.06354 5.23885C6.60577 4.08134 6.0905 2.94774 5.5194 1.84174C5.50023 1.79395 5.47157 1.75027 5.43548 1.71355C5.39938 1.67684 5.35638 1.64764 5.30893 1.62766C5.26147 1.60768 5.21027 1.59733 5.15878 1.59717C5.10729 1.59701 5.05686 1.60699 5.00928 1.62668C4.62787 1.81255 4.27476 2.05227 3.96149 2.33842C3.61889 2.58257 3.31915 2.88198 3.07501 3.22458C2.98101 3.38572 2.99491 3.56045 3.22319 3.72159C3.69319 4.0573 6.04288 5.35975 6.6203 5.61489C6.65918 5.61489 6.6995 5.6274 6.74121 5.64034C6.82916 5.66763 6.92336 5.69686 7.02355 5.61489H7.06354ZM23.2446 16.9618C22.8954 17.2976 22.5063 17.4454 22.1706 17.1231L22.1437 17.1903C22.0719 17.1261 22.0145 17.0475 21.9752 16.9595C21.9359 16.8716 21.9155 16.7762 21.9155 16.6799C21.9155 16.5836 21.9359 16.4885 21.9752 16.4006C22.0145 16.3126 22.0719 16.234 22.1437 16.1698C24.4587 13.7711 26.4252 11.0588 27.9852 8.1127C28.3831 7.29261 28.6936 6.43272 28.9117 5.54766C29.0325 4.84938 28.7638 4.43323 28.3609 4.33923C28.157 4.3252 27.9554 4.38562 27.7924 4.50905C27.6295 4.63248 27.5168 4.81055 27.4751 5.01065C27.2667 5.65777 27.0154 6.29019 26.723 6.90394C25.2538 10.0252 23.1499 12.806 20.5458 15.0685C20.4803 15.1406 20.4007 15.1983 20.3117 15.2377C20.2227 15.2771 20.1258 15.2974 20.0284 15.2974C19.9311 15.2974 19.8349 15.2771 19.7458 15.2377C19.6568 15.1983 19.5772 15.1406 19.5118 15.0685C19.4449 14.9896 19.3952 14.8974 19.3662 14.7981C19.3372 14.6987 19.3293 14.5944 19.3433 14.4919C19.3572 14.3893 19.3924 14.2907 19.4469 14.2027C19.5013 14.1147 19.5738 14.039 19.6593 13.9808C22.3839 11.661 24.5081 8.71731 25.8503 5.40013C26.0383 4.74213 25.7691 4.37955 25.5408 4.37955C25.3228 4.31645 25.0899 4.33323 24.8832 4.42676C24.6764 4.5203 24.5095 4.6843 24.413 4.88968C23.6202 6.79529 22.4772 8.53535 21.0428 10.0194C18.8819 12.3069 16.4769 14.3512 13.8716 16.116C13.5724 16.3997 13.1961 16.5883 12.7897 16.6576C12.3833 16.7269 11.9654 16.674 11.5891 16.5055C11.2723 16.2664 11.0348 15.9374 10.9079 15.5613C10.7809 15.1852 10.7699 14.7794 10.877 14.3971C10.9167 14.1559 10.9767 13.7992 11.0498 13.3644L11.0498 13.3644C11.2738 12.0324 11.6209 9.96785 11.8842 8.24679C12.0856 6.98451 11.3875 6.82358 11.0383 6.7833C10.6892 6.74301 10.327 6.94422 10.0719 7.56192C9.09766 10.1046 8.26812 12.7005 7.58746 15.3371C7.05339 17.6193 6.99347 19.9871 7.41239 22.2932C7.57281 22.8367 7.57281 23.4149 7.41239 23.9583C7.15999 24.6065 6.86864 25.2387 6.53967 25.8516C6.42892 26.079 6.24228 26.4455 6.04013 26.8425L6.04013 26.8425C5.7766 27.36 5.48674 27.9292 5.30436 28.3091C5.2207 28.4883 5.08779 28.6402 4.92144 28.7471C4.7551 28.8541 4.56251 28.9116 4.36476 28.9134C4.19023 28.913 4.0187 28.8666 3.86775 28.7789C3.64387 28.6467 3.47518 28.4377 3.39369 28.1908C3.3122 27.9438 3.32334 27.6756 3.42451 27.4361C4.06439 26.1467 4.78636 24.8997 5.58631 23.7029C5.68882 23.5291 5.72695 23.3247 5.69384 23.1256C5.15515 20.2719 5.20523 17.3383 5.84137 14.5047C6.45755 12.1214 7.23859 9.78374 8.17823 7.50849C9.0108 5.25251 10.5148 4.97046 11.5085 5.10474C11.855 5.15137 12.1877 5.27011 12.4854 5.45357C12.7832 5.63702 13.0394 5.88096 13.2369 6.16958C13.4343 6.45819 13.5691 6.78521 13.6322 7.12917C13.6954 7.47313 13.6855 7.82653 13.6034 8.16647C13.5195 9.02401 13.1767 11.292 12.9479 12.8058L12.9479 12.8062L12.9477 12.8073C12.847 13.4736 12.7684 13.9936 12.7438 14.1824C12.6901 14.5718 13.1063 14.6254 13.3883 14.424C15.6858 12.8853 17.7953 11.0825 19.6731 9.05263C21.0141 7.68301 22.1166 6.09906 22.9358 4.36611C23.1113 3.84802 23.4525 3.40204 23.9062 3.09637C24.3598 2.79071 24.901 2.64225 25.447 2.67411C25.6554 2.68116 25.8605 2.73006 26.0496 2.81771C26.2388 2.90536 26.4079 3.03015 26.5479 3.18456C26.5849 3.2176 26.6328 3.23571 26.6824 3.23571C26.7319 3.23571 26.7798 3.2176 26.8168 3.18456C27.0988 2.97678 27.4226 2.83183 27.7655 2.76001C28.1084 2.68818 28.4624 2.69109 28.8042 2.7682C29.3961 2.94644 29.897 3.34586 30.2021 3.88353C30.5072 4.42119 30.5933 5.05562 30.4427 5.65519C30.4178 5.75992 30.391 5.88503 30.3623 6.01882L30.3623 6.01884L30.3623 6.01886L30.3623 6.01889L30.3623 6.01892C30.3137 6.24535 30.2598 6.49665 30.2008 6.71609C30.1946 6.7337 30.1921 6.75224 30.1936 6.77084C30.195 6.78943 30.2004 6.80753 30.2093 6.82395C30.2181 6.84037 30.2306 6.85478 30.2453 6.86624C30.2601 6.8777 30.2764 6.88595 30.2945 6.8905C30.5817 6.95005 30.8536 7.06951 31.0918 7.24064C31.3301 7.41177 31.5293 7.63102 31.6774 7.88419C31.8255 8.13737 31.919 8.41885 31.9514 8.71036C31.9839 9.00187 31.955 9.29666 31.8662 9.57619C31.5687 10.7454 31.0882 11.8606 30.4427 12.8799C30.4342 12.8991 30.43 12.9198 30.4303 12.9408C30.4305 12.9619 30.4351 12.9828 30.444 13.0018C30.4529 13.0209 30.4654 13.038 30.4814 13.0517C30.4974 13.0653 30.5163 13.0753 30.5365 13.0812C31.651 13.39 32.2958 15.1761 31.0604 17.2576C30.1236 18.8291 29.0398 20.3081 27.8239 21.6752C25.36 24.337 22.3568 26.443 19.0148 27.8525C17.9387 28.3438 17.0323 29.1428 16.4097 30.1487C16.1178 30.5793 15.8534 31.0278 15.6176 31.4915C15.5381 31.6824 15.4035 31.8456 15.2314 31.9603C15.0594 32.075 14.8573 32.1361 14.6505 32.1361C14.4977 32.1374 14.3464 32.1056 14.2073 32.0423C13.9554 31.913 13.7648 31.6894 13.6768 31.4204C13.5888 31.1513 13.611 30.8585 13.7378 30.6054C13.7915 30.4711 13.9925 30.1217 14.6236 29.0474C15.4816 27.8511 16.6593 26.9203 18.0214 26.3618C22.4528 24.1192 24.7487 22.6556 27.0449 20.0908C28.2775 18.7174 29.3496 17.2084 30.2408 15.5924C30.3616 15.1224 30.2948 14.7328 29.8919 14.6522C29.7291 14.6278 29.5627 14.655 29.4159 14.7296C29.2691 14.8042 29.1493 14.9226 29.073 15.0685C27.9854 16.5779 26.7723 17.9931 25.447 19.2987C25.0308 19.715 24.5878 19.7417 24.3193 19.4866C24.251 19.4273 24.1961 19.3541 24.1586 19.2718C24.1211 19.1896 24.1016 19.1003 24.1016 19.0099C24.1016 18.9195 24.1211 18.8302 24.1586 18.7479C24.1961 18.6657 24.251 18.5924 24.3193 18.5332C26.687 16.1883 28.6473 13.4654 30.1201 10.4761C30.5901 9.58984 30.5901 8.78394 30.1201 8.59594C30.0269 8.56036 29.9273 8.5444 29.8277 8.54906C29.728 8.55372 29.6306 8.57904 29.5411 8.62315C29.4517 8.66727 29.3721 8.72922 29.3077 8.80543C29.2433 8.88165 29.1953 8.97047 29.1667 9.06607C27.6099 11.9865 25.6123 14.6495 23.2446 16.9618ZM15.1205 10.7716C15.0032 10.7724 14.8869 10.7475 14.7802 10.6988C14.6735 10.6501 14.5791 10.5788 14.5028 10.4896C14.3578 10.315 14.2838 10.092 14.2963 9.86542C14.3087 9.6388 14.4064 9.4251 14.5697 9.26744C15.9655 8.04427 17.1698 6.6185 18.1419 5.0376C18.3894 4.4776 18.8064 4.00943 19.3339 3.69869C19.8615 3.38795 20.4729 3.25023 21.0826 3.30528C21.304 3.34168 21.5024 3.46329 21.6354 3.64394C21.7684 3.82459 21.8257 4.04993 21.7947 4.27209C21.7678 4.4946 21.6536 4.69751 21.4774 4.83598C21.3011 4.97445 21.077 5.03724 20.8545 5.01072C20.2084 4.92028 19.7613 5.53835 19.537 5.84839L19.5116 5.88344C18.4689 7.62955 17.1593 9.20208 15.6306 10.5434C15.4817 10.6833 15.2848 10.7602 15.0805 10.7581L15.1205 10.7716ZM0.873109 25.0457C0.745561 25.0456 0.619178 25.0181 0.503302 24.9648C0.387426 24.9115 0.284786 24.8337 0.201686 24.7369C0.0552626 24.56 -0.0157835 24.3326 0.00432494 24.1039C0.0244334 23.8751 0.134181 23.6637 0.309219 23.515C1.31766 22.7257 2.38608 22.0162 3.50503 21.3932C3.71227 21.2941 3.94999 21.2793 4.16793 21.3519C4.38588 21.4246 4.56718 21.5791 4.67347 21.7827C4.72404 21.8841 4.75354 21.9943 4.76133 22.1073C4.76912 22.2203 4.7549 22.3337 4.71871 22.441C4.68252 22.5484 4.62547 22.6476 4.55085 22.7328C4.47623 22.818 4.3856 22.8877 4.28399 22.9377C3.28782 23.5067 2.33163 24.1438 1.42323 24.8444C1.26842 24.9731 1.07437 25.0441 0.873109 25.0457ZM5.54515 6.93519C5.65181 6.96941 5.78748 7.01293 5.78748 7.1728C5.81409 7.34576 5.68265 7.43963 5.5888 7.50664L5.58619 7.50851C5.08934 7.85765 2.80658 9.14662 2.30972 9.36147C2.26756 9.38927 2.21999 9.40767 2.17006 9.41524C2.12013 9.42281 2.06908 9.41945 2.02057 9.40541C1.97206 9.39136 1.92694 9.36701 1.88877 9.33394C1.85061 9.30086 1.8204 9.25996 1.7996 9.21395C1.62374 8.81839 1.51452 8.39612 1.477 7.96486C1.37532 7.54776 1.34379 7.11673 1.38324 6.68923C1.4101 6.4878 1.53072 6.35352 1.81271 6.35352C2.34985 6.38037 4.90157 6.76969 5.49242 6.91741C5.50849 6.92343 5.52634 6.92916 5.54509 6.93517L5.54513 6.93518L5.54515 6.93519ZM25.4199 27.0869C25.2519 27.0869 25.1962 27.2364 25.1564 27.3434L25.1518 27.3557C24.7643 28.5471 24.4372 29.7571 24.1715 30.9814C24.1575 31.0299 24.1535 31.0808 24.1604 31.1309C24.1672 31.1809 24.1849 31.2288 24.2115 31.2718C24.2381 31.3148 24.2728 31.3518 24.3144 31.3803C24.3561 31.4089 24.4038 31.4285 24.4535 31.4377C24.8764 31.5002 25.3058 31.5002 25.7288 31.4377C26.1576 31.4382 26.5836 31.3703 26.991 31.2364C27.0395 31.2203 27.0844 31.1942 27.1221 31.1597C27.1598 31.1252 27.1897 31.083 27.21 31.0361C27.2302 30.9892 27.2401 30.9384 27.2395 30.8873C27.2388 30.8362 27.2275 30.7858 27.206 30.7394C27.0449 30.2157 26.0242 27.8122 25.7288 27.2751C25.7288 27.1677 25.6079 27.0332 25.4199 27.0466V27.0869ZM26.9082 26.0687C26.8912 26.0009 26.8967 25.9295 26.9239 25.8651L26.9777 25.8517C27.0582 25.7174 27.2056 25.7172 27.3265 25.7172C27.9308 25.7575 30.509 26.1875 31.0462 26.3352C31.1474 26.3517 31.2383 26.4073 31.2986 26.4903C31.359 26.5733 31.3843 26.6767 31.3688 26.7781C31.2663 27.1852 31.1124 27.5779 30.9118 27.9466C30.7435 28.3284 30.517 28.6818 30.2403 28.994C30.2064 29.0315 30.1653 29.0614 30.119 29.0819C30.0728 29.1024 30.0228 29.113 29.9722 29.113C29.9216 29.113 29.8715 29.1024 29.8253 29.0819C29.779 29.0614 29.7373 29.0315 29.7033 28.994C29.2199 28.6315 27.3936 26.7246 27.0177 26.2411C26.9633 26.1971 26.9251 26.1365 26.9082 26.0687Z';
    case LikeCoinWalletConnectorMethodType.Leap:
      return 'm30.58,24.97c.11-.33.25-.81.41-1.37.32-1.12.68-2.56.87-3.88.1-.66.15-1.28.14-1.81-.01-.54-.09-.93-.23-1.17-.06-.12-.13-.19-.2-.23-.06-.04-.15-.07-.28-.07-.28,0-.72.15-1.38.59-.65.44-1.21.93-1.7,1.44-.2-.46-.47-.9-.79-1.33.25-.66.4-1.36.4-2.07,0-.87-.19-1.71-.55-2.49.38-.67.59-1.45.59-2.29,0-2.54-2.02-4.6-4.51-4.6-1.4,0-2.66.66-3.48,1.68-1.13-.26-2.33-.4-3.58-.4s-2.45.14-3.58.4c-.84-1.02-2.09-1.68-3.48-1.68-2.49,0-4.51,2.06-4.51,4.6,0,.84.22,1.61.59,2.29-.36.78-.55,1.62-.55,2.49,0,.69.14,1.36.37,2-.35.46-.64.93-.85,1.43-.55-.52-1.17-1.01-1.9-1.45h0c-.73-.44-1.23-.6-1.56-.6-.29,0-.45.11-.58.31-.14.24-.23.63-.25,1.16-.01.52.04,1.14.15,1.8.21,1.32.61,2.76.96,3.88.17.56.34,1.03.45,1.37.06.17.11.3.14.39.02.04.03.08.04.1v.03s.01,0,.01,0h0s0,0,0,0l.13.34-.31.18-1.24.73s0,0,0,0c-.01,0-.02.01-.02.01,0,0,0,0,0,0,0,0,0,.02,0,.03,0,.02.01.02.01.03,0,0,0,0,0,0,0,0,0,0,.02,0h7.06c.33,0,.6-.3.56-.64-.01-.1-.03-.2-.04-.3,2.21.88,5.13,1.3,8.37,1.3s6.42-.46,8.64-1.42c-.02.15-.04.29-.05.43-.04.4.24.65.46.65h6.36s0-.01,0-.02c0-.02,0-.04,0-.06,0,0,0-.01-.01-.02,0,0,0,0,0,0l-1.13-.73-.28-.18.11-.32h0s0,0,0,0h0s0-.03,0-.03c0-.02.02-.06.03-.1.03-.09.07-.22.13-.39Zm-6.98-17.72c1.52,0,2.76,1.26,2.76,2.81s-1.23,2.81-2.76,2.81-2.76-1.26-2.76-2.81,1.23-2.81,2.76-2.81Zm-14.73,0c1.52,0,2.76,1.26,2.76,2.81s-1.23,2.81-2.76,2.81-2.76-1.26-2.76-2.81,1.23-2.81,2.76-2.81Zm14.21,2.78c0-.28.22-.51.5-.51s.5.23.5.51-.22.51-.5.51-.5-.23-.5-.51Zm-14.73,0c0-.28.22-.51.5-.51s.5.23.5.51-.22.51-.5.51-.5-.23-.5-.51Z';
    case LikeCoinWalletConnectorMethodType.MetaMaskLeap:
      return 'm54 26 2 2-4 4 4 12-2 10-12-4-6 4h-8l-6-4-12 4-2-10 4-12-4-4 2-2-2-10 2-8 14 8h16l14-8 2 8-2 10z';
    case LikeCoinWalletConnectorMethodType.Cosmostation:
    case LikeCoinWalletConnectorMethodType.CosmostationMobile:
      return 'M10.82,24.85,4.75,14.34a1.76,1.76,0,0,1,0-1.72l6.07-10.5a1.72,1.72,0,0,1,1.49-.87H24.44a1.7,1.7,0,0,1,1.49.87L32,12.62l-3,1.73L23.44,4.7H13.3L8.23,13.48l5.56,9.65-3,1.72Zm8.86,5.7H7.56a1.71,1.71,0,0,1-1.49-.86L0,19.19l3-1.73,5.57,9.65H18.68l5.08-8.78L18.19,8.68l3-1.72,6.07,10.5a1.78,1.78,0,0,1,0,1.73l-6.07,10.5a1.73,1.73,0,0,1-1.49.86Z';
    case LikeCoinWalletConnectorMethodType.WalletConnectV2:
      return 'M17.83 23a20.33 20.33 0 0128.34 0l.95.92a1 1 0 010 1.39l-3.23 3.19a.5.5 0 01-.71 0l-1.29-1.27a14.21 14.21 0 00-19.78 0l-1.39 1.36a.48.48 0 01-.7 0l-3.23-3.15a1 1 0 010-1.39zm35 6.52l2.87 2.81a1 1 0 010 1.39l-12.93 12.7a1 1 0 01-1.41 0l-9.18-9a.25.25 0 00-.36 0l-9.18 9a1 1 0 01-1.41 0L8.29 33.76a1 1 0 010-1.39l2.87-2.81a1 1 0 011.42 0l9.18 9a.24.24 0 00.35 0l9.18-9a1 1 0 011.42 0l9.18 9a.24.24 0 00.35 0l9.18-9a1 1 0 011.42 0z';
    default:
      return '';
  }
}

/**
 * Svg icon for a connection method
 */
export const ConnectionMethodIcon: FC<Props> = ({ type, ...props }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox={getIconViewBox(type)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={getIconPath(type)}
        fill="currentColor"
      />
    </svg>
  );
};
