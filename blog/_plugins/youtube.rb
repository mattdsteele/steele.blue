module Jekyll
  class Youtube < Liquid::Tag

    def initialize(name, id, tokens)
      super
      @id = id
    end

    def render(context)
      %(<div class="video-wrapper"><iframe src="//www.youtube.com/embed/#{@id}"></iframe></div>)
    end
  end
end

Liquid::Template.register_tag('youtube', Jekyll::Youtube)
