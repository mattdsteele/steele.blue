module Jekyll
  class Vine < Liquid::Tag

    def initialize(name, id, tokens)
      super
      @id = id
    end

    def render(context)
      %(<style>.embed-container {position: relative; padding-bottom: 100%; padding-top: 30px; height: 0; overflow: hidden;} .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class="embed-container"><iframe width="100%" class="vine-embed" src="https://vine.co/v/#{@id}/embed/simple" frameborder="0" scrolling="no"></iframe><script async src="//platform.vine.co/static/scripts/embed.js" charset="utf-8"></script></div>)
    end
  end
end

Liquid::Template.register_tag('vine', Jekyll::Vine)

