---
layout: page
permalink: /photography/
title: photography
description: Photographs I take outside of research.
nav: true
nav_order: 2
class: photography-page
# Not built at all while this is false: no page, no nav entry, no URL, no
# sitemap record. To release, set this to true AND photography_released to
# true in _config.yml (that flag also restores the about page's pointer),
# then restore the images with:
#   git checkout 8f469ed -- assets/img/photography
published: false
---

{% if site.photography_released %}
{%- assign photos = site.data.photography -%}
{%- assign current_theme = "" -%}

<div class="photo-page">
{%- for photo in photos %}
  {%- if photo.theme != current_theme -%}
    {%- unless forloop.first %}
  </div>
    {%- endunless %}
  <h2 class="section-heading">{{ photo.theme }}</h2>
  <div class="photo-grid">
    {%- assign current_theme = photo.theme -%}
  {%- endif %}
    <button type="button" class="photo" style="--ar: {{ photo.ar }}"
      data-ar="{{ photo.ar }}"
      data-full="{{ '/assets/img/photography/' | append: photo.id | append: '_full.jpg' | relative_url }}"
      data-location="{{ photo.location | default: '' | escape }}"
      data-device="{{ photo.device | escape }}"
      data-date="{{ photo.date_label }}"
      aria-label="{{ photo.description | default: photo.location | default: photo.theme | escape }}">
      <img
        src="{{ '/assets/img/photography/' | append: photo.id | append: '.jpg' | relative_url }}"
        alt="{{ photo.description | default: photo.location | default: photo.theme | escape }}"
        width="{{ photo.width }}" height="{{ photo.height }}"
        loading="lazy" decoding="async">
      {%- if photo.description or photo.location %}
      <span class="photo-hover">
        {%- if photo.description %}<span class="photo-desc">{{ photo.description }}</span>{% endif -%}
        {%- if photo.location %}<span class="photo-meta">{{ photo.location }}</span>{% endif -%}
      </span>
      {%- endif %}
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

<script src="{{ '/assets/js/gallery.js' | relative_url | bust_file_cache }}" defer></script>
{% else %}

<div class="construction">
  <p class="construction-title">Under construction</p>
  <p class="construction-note">I'm still working on how these are laid out. Photos will go up here once it's ready.</p>
</div>

{% endif %}
