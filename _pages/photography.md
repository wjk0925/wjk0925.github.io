---
layout: page
permalink: /photography/
title: photography
description: Photographs I take outside of research.
nav: true
nav_order: 2
class: photography-page
---

{% if site.photography_released %}
{%- assign photos = site.data.photography -%}
{%- assign current_month = "" -%}

<div class="photo-page">
{%- for photo in photos %}
  {%- if photo.month != current_month -%}
    {%- unless forloop.first %}
  </div>
    {%- endunless %}
  <h2 class="section-heading">{{ photo.month_label }}</h2>
  <div class="photo-grid">
    {%- assign current_month = photo.month -%}
  {%- endif %}
    <button type="button" class="photo"
      data-index="{{ forloop.index0 }}"
      data-full="{{ '/assets/img/photography/' | append: photo.id | append: '_full.jpg' | relative_url }}"
      data-desc="{{ photo.description | default: '' | escape }}"
      data-location="{{ photo.location | escape }}"
      data-device="{{ photo.device | escape }}"
      data-date="{{ photo.date }}"
      aria-label="{{ photo.description | default: photo.location | escape }}">
      <img
        src="{{ '/assets/img/photography/' | append: photo.id | append: '.jpg' | relative_url }}"
        alt="{{ photo.description | default: photo.location | escape }}"
        width="{{ photo.width }}" height="{{ photo.height }}"
        loading="lazy" decoding="async">
      <span class="photo-hover">
        {%- if photo.description %}<span class="photo-desc">{{ photo.description }}</span>{% endif -%}
        <span class="photo-meta">{{ photo.location }}</span>
      </span>
    </button>
{%- endfor %}
  </div>
</div>

<!-- Lightbox -->
<div class="lightbox" id="lightbox" hidden>
  <button class="lightbox-close" type="button" aria-label="Close">&times;</button>
  <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous">&#8249;</button>
  <button class="lightbox-nav lightbox-next" type="button" aria-label="Next">&#8250;</button>
  <figure class="lightbox-figure">
    <img class="lightbox-img" alt="">
    <figcaption class="lightbox-caption">
      <span class="lightbox-meta"></span>
    </figcaption>
  </figure>
</div>

<script src="{{ '/assets/js/lightbox.js' | relative_url | bust_file_cache }}" defer></script>
{% else %}

<div class="construction">
  <p class="construction-title">Under construction</p>
  <p class="construction-note">I'm still working on how these are laid out. Photos will go up here once it's ready.</p>
</div>

{% endif %}
