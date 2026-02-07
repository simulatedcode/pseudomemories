<svg width="0" height="0">
  <defs>
    <filter id="ditherCloud">
      <!-- Organic cloud noise -->
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.03"
        numOctaves="2"
        seed="8"
        result="noise"
      />

      <!-- Increase contrast (hard threshold) -->
      <feColorMatrix
        type="matrix"
        values="
          6 0 0 0 -2
          0 6 0 0 -2
          0 0 6 0 -2
          0 0 0 1  0
        "
        result="threshold"
      />

      <!-- Snap to dots -->
      <feComponentTransfer>
        <feFuncR type="discrete" tableValues="0 1"/>
        <feFuncG type="discrete" tableValues="0 1"/>
        <feFuncB type="discrete" tableValues="0 1"/>
      </feComponentTransfer>
    </filter>
  </defs>
</svg>