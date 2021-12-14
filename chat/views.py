from django.shortcuts import render


def index(request):
    return render(request, 'chat/index.html', {})


def room(request, room_name):
    return render(request, 'chat/new_room.html', {
        'room_name': room_name
    })

def file(request):
    return render(request, 'chat/file.html', {})

def test(resquest):
    return render(resquest, 'chat/test.html', {})
