---
layout: page
permalink: /photography/
title: photography
description: Some photos I have taken, newest first.
nav: true
nav_order: 2
class: photography-page
---

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
    <figure class="photo{% if photo.panorama %} photo--wide{% endif %}">
      <img
        src="{{ '/assets/img/photography/' | append: photo.id | append: '.jpg' | relative_url }}"
        data-zoom-src="{{ '/assets/img/photography/' | append: photo.id | append: '_full.jpg' | relative_url }}"
        width="{{ photo.width }}" height="{{ photo.height }}"
        style="aspect-ratio: {{ photo.width }} / {{ photo.height }}"
        alt="{{ photo.description | default: photo.location | escape }}"
        loading="lazy" decoding="async" data-zoomable>
      <figcaption class="photo-caption">
        {%- if photo.description %}
        <span class="photo-desc">{{ photo.description }}</span>
        {%- endif %}
        <span class="photo-meta">{{ photo.location }}<span class="photo-sep">&middot;</span>{{ photo.device }}</span>
      </figcaption>
    </figure>
{%- endfor %}
  </div>
</div>
